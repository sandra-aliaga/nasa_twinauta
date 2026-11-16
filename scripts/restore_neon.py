"""Check or restore the verified backup without exposing database credentials."""

import argparse
import hashlib
import os
import re
import subprocess
from pathlib import Path

import psycopg
from dotenv import dotenv_values
from psycopg import sql
from psycopg.conninfo import conninfo_to_dict

ROOT = Path(__file__).resolve().parents[1]
BACKUP = ROOT / "backups/twinnauta-current-20261116.dump"


def backup_rows() -> dict[str, tuple[list[str], list[str]]]:
    """Check the archive checksum and read its COPY records in memory."""
    expected_hash = None
    for line in (ROOT / "backups/SHA256SUMS").read_text().splitlines():
        digest, filename = line.split(maxsplit=1)
        if filename == str(BACKUP.relative_to(ROOT)):
            expected_hash = digest
    with BACKUP.open("rb") as stream:
        if (
            expected_hash is None
            or hashlib.file_digest(stream, "sha256").hexdigest() != expected_hash
        ):
            raise ValueError("El respaldo no coincide con SHA256SUMS.")
    result = subprocess.run(
        ["pg_restore", "--data-only", "--file=-", str(BACKUP)],
        capture_output=True,
        text=True,
    )
    if result.returncode:
        raise RuntimeError("No se pudo leer el respaldo. Usa pg_restore 18 o posterior.")
    tables = {}
    active = None
    for line in result.stdout.splitlines():
        match = re.fullmatch(r"COPY public\.(\w+) \((.*?)\) FROM stdin;", line)
        if match:
            active = match.group(1)
            tables[active] = (match.group(2).split(", "), [])
        elif line == r"\.":
            active = None
        elif active is not None:
            tables[active][1].append(line)
    if len(tables) != 7:
        raise ValueError("El respaldo no contiene las siete tablas esperadas.")
    return tables


def verify_rows(connection, tables) -> None:
    """Compare every restored row, independent of row order."""
    # The source archive serializes timestamptz in the local database timezone.
    connection.execute("SET LOCAL TIME ZONE 'America/Lima'")
    for table, (columns, expected) in tables.items():
        query = sql.SQL("COPY public.{} ({}) TO STDOUT").format(
            sql.Identifier(table), sql.SQL(", ").join(map(sql.Identifier, columns))
        )
        with connection.cursor().copy(query) as stream:
            actual = b"".join(bytes(chunk) for chunk in stream).decode().splitlines()
        if sorted(actual) != sorted(expected):
            raise RuntimeError(f"La tabla {table} difiere del respaldo.")
        print(f"{table}: {len(actual)} filas, contenido verificado")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--restore", action="store_true", help="Restaurar solo si la base esta vacia"
    )
    parser.add_argument("--env-file", type=Path, default=ROOT / ".env.local")
    args = parser.parse_args()
    tables = backup_rows()
    values = dotenv_values(args.env_file)
    url = values.get("DATABASE_URL_UNPOOLED")
    if not url:
        raise ValueError("Falta DATABASE_URL_UNPOOLED en el archivo privado.")
    params = conninfo_to_dict(url.replace("postgresql+psycopg://", "postgresql://", 1))
    if "-pooler" in params.get("host", ""):
        raise ValueError("La restauracion requiere conexion directa, sin pooler.")
    with psycopg.connect(**params, connect_timeout=15) as connection:
        connection.execute("SET TRANSACTION READ ONLY")
        existing = connection.execute(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
        ).fetchall()
        if existing:
            if {row[0] for row in existing} == set(tables):
                verify_rows(connection, tables)
                print("La base ya coincide con el respaldo; no se modifico nada.")
                return
            raise ValueError("La base contiene tablas. No se borrara ni sobrescribira nada.")
    print("Respaldo integro; conexion directa correcta; base de destino vacia.")
    if not args.restore:
        print("Comprobacion terminada. Anade --restore para cargar el respaldo.")
        return
    env = {key: value for key, value in os.environ.items() if not key.startswith("PG")}
    names = {
        "host": "PGHOST",
        "port": "PGPORT",
        "dbname": "PGDATABASE",
        "user": "PGUSER",
        "password": "PGPASSWORD",
        "sslmode": "PGSSLMODE",
        "channel_binding": "PGCHANNELBINDING",
        "options": "PGOPTIONS",
    }
    for key, variable in names.items():
        if key in params:
            env[variable] = params[key]
    env["PGCONNECT_TIMEOUT"] = "15"
    result = subprocess.run(
        [
            "pg_restore",
            "--dbname",
            params["dbname"],
            "--no-owner",
            "--no-privileges",
            "--single-transaction",
            "--exit-on-error",
            str(BACKUP),
        ],
        env=env,
        capture_output=True,
    )
    if result.returncode:
        raise RuntimeError(
            "pg_restore fallo; la transaccion se revirtio. No se muestran credenciales."
        )
    with psycopg.connect(**params, connect_timeout=15) as connection:
        connection.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY")
        verify_rows(connection, tables)
    print("Restauracion completada; las siete tablas coinciden con el respaldo.")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, RuntimeError, psycopg.Error) as error:
        # Driver errors can include connection details; never print them.
        message = (
            str(error) if isinstance(error, (ValueError, RuntimeError)) else type(error).__name__
        )
        print(f"No se completo la operacion: {message}")
        raise SystemExit(1) from None
