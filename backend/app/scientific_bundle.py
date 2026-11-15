"""Build and verify a portable candidate library using local files only."""

import argparse
import json
import tempfile
from copy import deepcopy
from hashlib import sha256
from pathlib import Path
from typing import Annotated, Any, Literal

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter, ValidationError

from app.config import BACKEND_DIR
from app.guidance import RULES_VERSION
from app.schemas import IndicatorDefinition, KnowledgeBaseMetadata, ModuleCatalog, PaperIdentifiers

FILES = ("corpus.json", "knowledge_base.json", "health-modules.json", "indicators.json")


class BundleError(ValueError):
    """Report invalid assets without printing their full contents."""


class AssetDigest(BaseModel):
    """Describe the exact bytes of one permitted asset."""

    model_config = ConfigDict(extra="forbid")
    sha256: Annotated[str, Field(pattern=r"^[a-f0-9]{64}$")]
    size_bytes: Annotated[int, Field(ge=0, strict=True)]


class BundleManifest(BaseModel):
    """Identify content independently of its location or packaging time."""

    model_config = ConfigDict(extra="forbid")
    format_version: Literal["1.0"]
    bundle_id: str
    corpus_version: str
    module_catalog_version: str
    operational_rules_version: str
    files: dict[str, AssetDigest]
    exclusions: list[str]


class CandidateRecord(BaseModel):
    """Check the raw fields consumed by the existing import and search services."""

    model_config = ConfigDict(extra="allow")
    id: Annotated[str, Field(min_length=1)]
    title: Annotated[str, Field(min_length=1)]
    publication_year: Annotated[int, Field(ge=1800)]
    identifiers: PaperIdentifiers
    authors: list[dict[str, Any]]
    abstract_text: str | None
    publication_types_from_index: list[str]
    review_status: Literal["identified_not_fulltext_audited", "reviewed"]
    model_parameter_eligible: Annotated[bool, Field(strict=True)]
    clinical_action_eligible: Annotated[bool, Field(strict=True)]


def bundle_id(manifest: BundleManifest) -> str:
    """Bind the manifest metadata and hashes to one reproducible identifier."""
    payload = manifest.model_dump(exclude={"bundle_id"})
    serialized = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    return "sha256:" + sha256(serialized).hexdigest()


def validate_documents(documents: dict[str, Any]) -> tuple[KnowledgeBaseMetadata, ModuleCatalog]:
    """Check counts, identifiers and module coverage without approving evidence."""
    try:
        metadata = KnowledgeBaseMetadata.model_validate(documents["knowledge_base.json"])
        modules = ModuleCatalog.model_validate(documents["health-modules.json"])
        indicators = TypeAdapter(list[IndicatorDefinition]).validate_python(
            documents["indicators.json"]
        )
        corpus = documents["corpus.json"]
        records = corpus["records"]
        TypeAdapter(list[CandidateRecord]).validate_python(records)
        paper_ids = [record["id"] for record in records]
        if not all(isinstance(value, str) and value for value in paper_ids):
            raise BundleError("Corpus paper identifiers must be nonempty strings.")
        if len(paper_ids) != len(set(paper_ids)):
            raise BundleError("Corpus contains duplicate paper identifiers.")
        if len(records) != metadata.paper_count or corpus["selected_count"] != len(records):
            raise BundleError("Corpus size differs from its published metadata.")
        reviewed = 0
        for record in records:
            if record["review_status"] not in {"identified_not_fulltext_audited", "reviewed"}:
                raise BundleError("Corpus contains an unknown review status.")
            reviewed += record["review_status"] == "reviewed"
            if record["review_status"] != "reviewed" and (
                record["clinical_action_eligible"] or record["model_parameter_eligible"]
            ):
                raise BundleError("An unreviewed candidate cannot enable scientific actions.")
        if reviewed != metadata.reviewed_paper_count:
            raise BundleError("Reviewed paper count differs from its metadata.")
        ids = {item.id for item in indicators}
        if len(ids) != len(indicators) or len({m.id for m in modules.modules}) != len(
            modules.modules
        ):
            raise BundleError("Catalog contains duplicate identifiers.")
        if any(not set(module.indicator_ids).issubset(ids) for module in modules.modules):
            raise BundleError("A module references an unpublished indicator.")
        if (
            metadata.runtime_mode != "local_bundle"
            or metadata.external_services_required_for_consultation
        ):
            raise BundleError(
                "Bundle metadata must describe consultation without external services."
            )
        return metadata, modules
    except (ValidationError, KeyError, TypeError) as error:
        raise BundleError("Scientific assets have an invalid structure.") from error


class ScientificBundle:
    """Keep validated local documents separate from mutable database history."""

    def __init__(self, path: Path):
        self.path = path.resolve()
        manifest_path = self.path / "manifest.json"
        if manifest_path.is_symlink():
            raise BundleError("Manifest cannot be a symbolic link.")
        try:
            self.manifest = BundleManifest.model_validate_json(manifest_path.read_bytes())
        except ValidationError as error:
            raise BundleError("Bundle manifest is invalid.") from error
        if set(self.manifest.files) != set(FILES):
            raise BundleError("Manifest must contain exactly the four supported scientific assets.")
        if self.manifest.bundle_id != bundle_id(self.manifest):
            raise BundleError("Bundle identifier does not match its manifest.")
        documents = {}
        for name, expected in self.manifest.files.items():
            source = self.path / name
            if source.is_symlink() or not source.is_file():
                raise BundleError("Bundle assets must be regular local files.")
            content = source.read_bytes()
            if (
                len(content) != expected.size_bytes
                or sha256(content).hexdigest() != expected.sha256
            ):
                raise BundleError(f"Asset checksum or size mismatch: {name}")
            try:
                documents[name] = json.loads(content)
            except (ValueError, UnicodeError) as error:
                raise BundleError(f"Invalid JSON asset: {name}") from error
        metadata, modules = validate_documents(documents)
        if (
            metadata.corpus_version != self.manifest.corpus_version
            or modules.catalog_version != self.manifest.module_catalog_version
            or self.manifest.operational_rules_version != RULES_VERSION
        ):
            raise BundleError(
                "Bundle versions are inconsistent or unsupported by this application."
            )
        self.metadata = metadata
        self.modules = modules
        self._documents = documents

    def document(self, name: str) -> Any:
        """Return a copy so callers cannot mutate the verified in-memory package."""
        if name not in FILES:
            raise BundleError("Requested document is not included in this bundle.")
        return deepcopy(self._documents[name])


def build_bundle(output_dir: Path) -> ScientificBundle:
    """Stage a complete package, validate it and publish without overwriting."""
    source_dirs = [BACKEND_DIR / "data/literature/candidates", BACKEND_DIR / "data/demo"]
    target = output_dir.resolve()
    if any(target.is_relative_to(source.resolve()) for source in source_dirs):
        raise BundleError("Output must be outside the original scientific source directories.")
    if target.exists():
        raise BundleError("Output directory already exists; choose a new destination.")
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".bundle-stage-", dir=target.parent) as temporary:
        stage = Path(temporary) / "bundle"
        stage.mkdir()
        hashes = {}
        for name in FILES:
            source = (
                source_dirs[0] if name in {"corpus.json", "knowledge_base.json"} else source_dirs[1]
            )
            content = (source / name).read_bytes()
            (stage / name).write_bytes(content)
            hashes[name] = AssetDigest(sha256=sha256(content).hexdigest(), size_bytes=len(content))
        documents = {name: json.loads((stage / name).read_bytes()) for name in FILES}
        metadata, modules = validate_documents(documents)
        manifest = BundleManifest(
            format_version="1.0",
            bundle_id="pending",
            corpus_version=metadata.corpus_version,
            module_catalog_version=modules.catalog_version,
            operational_rules_version=RULES_VERSION,
            files=hashes,
            exclusions=[
                "full_texts",
                "pdfs",
                "generated_analyses",
                "clinical_rules",
                "database",
                "telemetry",
                "frontend_assets",
            ],
        )
        manifest.bundle_id = bundle_id(manifest)
        (stage / "manifest.json").write_text(manifest.model_dump_json(indent=2) + "\n")
        ScientificBundle(stage)
        if target.exists():
            raise BundleError("Output appeared during preparation; nothing was overwritten.")
        stage.rename(target)
    return ScientificBundle(target)


def main() -> None:
    """Build or verify files without database connections, downloads or AI calls."""
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    build = commands.add_parser("build")
    build.add_argument("--output-dir", type=Path, required=True)
    verify = commands.add_parser("verify")
    verify.add_argument("path", type=Path)
    args = parser.parse_args()
    try:
        bundle = (
            build_bundle(args.output_dir)
            if args.command == "build"
            else ScientificBundle(args.path)
        )
    except (OSError, ValueError) as error:
        parser.exit(1, f"Bundle operation failed: {error}\n")
    print(
        f"Verified {bundle.metadata.paper_count} papers, {bundle.metadata.reviewed_paper_count} reviewed."
    )
    print(f"Bundle: {bundle.manifest.bundle_id}")
    print(f"Directory: {bundle.path}")


if __name__ == "__main__":
    main()
