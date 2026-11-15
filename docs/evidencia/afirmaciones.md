# Afirmaciones que necesita el grafo del cuádriceps

Lista de trabajo. Define cuándo el grafo está completo: cada hallazgo, escenario y acción debe poder rastrearse hasta una de estas afirmaciones revisadas, o mostrarse como pendiente. Medicina debe revisar esta lista; se pueden añadir, fusionar o descartar filas.

| claim_id | Afirmación a investigar | Vista del grafo | Fuente de partida | Estado |
| --- | --- | --- | --- | --- |
| `claim_bedrest_quadriceps_csa_rate` | Tasa de cambio del área transversal del cuádriceps durante reposo en cama prolongado, con su método y periodo. | scenario | [NASA Bed Rest 2020](https://doi.org/10.1097/CCE.0000000000000269), suplemento eTable 3 | investigada y verificada (corrected); falta Medicina |
| `claim_sprint_knee_extension_torque` | Cambio del torque de extensión de rodilla antes/después de reposo en cama con y sin protocolo de ejercicio (SPRINT). | evidence, actions | [SPRINT 2024](https://journals.physiology.org/doi/full/10.1152/japplphysiol.00489.2023) Table 1 y [Ploutz-Snyder 2018](https://doi.org/10.1249/MSS.0000000000001618) Table 3 (misma cohorte) | investigada y verificada (corrected); falta Medicina |
| `claim_bedrest_spaceflight_transfer` | Hasta qué punto los cambios musculares en reposo en cama son trasladables a vuelo espacial de larga duración. | scenario (limitación) | [Böcker 2026](https://www.nature.com/articles/s41526-026-00611-2) (pantorrilla, no muslo) y NASA HRP-47072 | investigada y verificada (corrected); falta Medicina |
| `claim_exercise_countermeasure_quadriceps` | Efecto del ejercicio de resistencia en vuelo sobre la masa o el área del cuádriceps. | actions | Scott 2023 (npj Microgravity 9:11) y Comfort 2021 (contraevidencia) | investigada y verificada (corrected; descriptivo, no causal); falta Medicina |
| `claim_nasa_gap_ma201` | Brecha documentada por NASA sobre contramedidas musculares y aeróbicas con recursos limitados. | evidence (contexto) | [HRR MA-201](https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833) | investigada y verificada (corrected); falta Medicina |
| `claim_missing_log_not_noncompliance` | Un registro de ejercicio ausente no demuestra que la sesión no se realizó (regla operativa). | evidence, actions | OCHMO-TB-031 y NASA SP-20250000273 (contexto); regla operativa | verificada (corrected); falta Medicina |
| `claim_terrestrial_hr_not_astronaut` | Límite de usar frecuencia cardíaca de ejercicio terrestre como material didáctico. | telemetría | [PhysioNet 1.0.1](https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/) | investigada y verificada (corrected); licencia de PhysioNet por resolver; falta Medicina |

## Notas de la tanda piloto (14 de noviembre de 2026)

- `claim_bedrest_quadriceps_csa_rate` y `claim_sprint_knee_extension_torque` proceden del mismo ensayo NASA de 70 días (NCT00891449). No son evidencia independiente entre sí.
- Los verificadores de la tanda piloto leyeron la ficha completa antes de terminar su comprobación; lo declararon y contrastaron las cifras con las fuentes. En adelante se les entregará solo un extracto de fuentes y cifras.
- Ver `fichas/` y `verificaciones/` para el detalle. Ninguna ficha está revisada por Medicina.
