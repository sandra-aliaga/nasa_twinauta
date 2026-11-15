# Fichas de evidencia

Material de trabajo para completar el grafo de conocimiento. Todo lo que está aquí es **candidato**: una ficha solo pasa a `reviewed` cuando Medicina la revisa y firma. Ni el agente investigador ni el verificador pueden marcar una ficha como revisada.

## Flujo

1. [afirmaciones.md](afirmaciones.md) lista las afirmaciones que necesita el grafo. Define cuándo está "completo".
2. El agente `evidence-researcher` escribe `fichas/<claim_id>.md`.
3. El agente `evidence-verifier` contrasta la ficha de forma independiente y escribe `verificaciones/<claim_id>.md`.
4. Medicina revisa ambos archivos y registra su decisión en la ficha.
5. Backend carga solo lo revisado. Lo pendiente puede mostrarse en el grafo como pendiente, nunca como respaldo.

## Estructura de una ficha

```markdown
# <claim_id>: <afirmación en una línea>

- Estado: pending | verified_by_agent | corrected | discarded | reviewed
- Investigado: <fecha> por evidence-researcher
- Revisión de Medicina: pendiente | <nombre, fecha, decisión>

## Pregunta e hipótesis
Pregunta, hipótesis actual y qué hallazgo la refutaría o modificaría.

## Datos para el contrato
Bloque JSON con `sources` (forma `Source`) y `claim` (forma `EvidenceClaim`) de contracts/openapi.yaml, con review_status "pending".

## Extracción
Tabla/figura/archivo exacto, valores con unidades y tal como aparecen, transformaciones aplicadas.
Población, muestra, entorno, protocolo, calendario de medición.

## Contraevidencia e independencia
Segunda búsqueda: resultados contradictorios, replicación, correcciones. Si otras publicaciones usan la misma cohorte.

## Comparación con NASA
Qué capacidad o brecha publicada por NASA se relaciona y en qué estado está.

## Conclusión
Mantener, modificar, descartar o dejar pendiente, con motivo.

## No verificado y siguiente contraste
Lo que no pudo leerse (p. ej. texto de pago) y el siguiente paso necesario.

## Registro de búsqueda
Consultas realizadas, URLs consultadas y fecha.
```

Reglas: no inventar cifras, umbrales, porcentajes de confianza ni ubicaciones. Si una tabla no pudo leerse, decirlo; no reconstruirla desde el resumen. No convertir medias de un artículo en datos individuales.
