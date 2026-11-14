"""Build the three graph views from one assessment snapshot."""

from app.schemas import Assessment, Graph, GraphEdge, GraphNode

GRAPH_VIEWS = ("evidence", "scenario", "actions")


def build_graphs(assessment: Assessment) -> dict[str, Graph]:
    """Create informational edges without inventing causal or scientific support."""
    return {view: build_graph(assessment, view) for view in GRAPH_VIEWS}


def build_graph(assessment: Assessment, view: str) -> Graph:
    """Project one view without capturing mutable state from a loop."""
    nodes: dict[str, GraphNode] = {}
    edges: list[GraphEdge] = []

    def add_node(
        entity_id: str, kind: str, label: str, description: str, source_ids: list[str]
    ) -> str:
        node_id = f"{kind}:{entity_id}"
        nodes[node_id] = GraphNode(
            id=node_id,
            kind=kind,
            label=label,
            description=description,
            source_ids=source_ids,
            entity_id=entity_id,
        )
        return node_id

    def add_edge(source: str, target: str, relation: str, label: str) -> None:
        edges.append(
            GraphEdge(
                id=f"edge_{len(edges)}",
                source=source,
                target=target,
                relation=relation,
                label=label,
                claim_ids=[],
            )
        )

    if view == "evidence":
        entities = {}
        for observation in assessment.observations:
            entities[observation.id] = add_node(
                observation.id,
                "observation",
                observation.indicator_id,
                observation.method,
                [observation.source_id],
            )
        for exercise in assessment.exercise_records:
            entities[exercise.id] = add_node(
                exercise.id,
                "exercise",
                f"Registro de ejercicio, día {exercise.mission_day}",
                exercise.record_status,
                [exercise.source_id],
            )
        for finding in assessment.findings:
            node_id = add_node(
                finding.id, "finding", finding.title, finding.description, finding.source_ids
            )
            for entity_id in finding.related_ids:
                add_edge(node_id, entities[entity_id], "uses", "Utiliza este registro")
    elif view == "scenario":
        scenario = assessment.scenario
        node_id = add_node(
            scenario.id, "scenario", scenario.label, scenario.summary, scenario.source_ids
        )
        limitation_id = "limitation:model_pending"
        nodes[limitation_id] = GraphNode(
            id=limitation_id,
            kind="limitation",
            label="Modelo pendiente",
            description=scenario.reason or "Consultar las condiciones del modelo.",
            source_ids=scenario.source_ids,
            entity_id=None,
        )
        add_edge(node_id, limitation_id, "limited_by", "Limitado por")
    else:
        for action in assessment.actions:
            action_id = add_node(
                action.id, "action", action.title, action.rationale, action.source_ids
            )
            for finding in assessment.findings:
                if finding.id in action.related_finding_ids:
                    finding_id = add_node(
                        finding.id,
                        "finding",
                        finding.title,
                        finding.description,
                        finding.source_ids,
                    )
                    add_edge(action_id, finding_id, "addresses", "Revisa esta falta de información")

    used_sources = {source_id for node in nodes.values() for source_id in node.source_ids}
    sources = [source for source in assessment.sources if source.id in used_sources]
    for source in sources:
        source_node = add_node(source.id, "source", source.title, source.locator, [source.id])
        for node in tuple(nodes.values()):
            if node.kind != "source" and source.id in node.source_ids:
                add_edge(node.id, source_node, "describes", "Procedencia o referencia candidata")

    return Graph(
        assessment_id=assessment.assessment_id,
        view=view,
        nodes=list(nodes.values()),
        edges=edges,
        sources=sources,
        content_mode=assessment.content_mode,
        versions=assessment.versions,
        claims=[],
    )
