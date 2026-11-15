# Handoff: HEART-AUTOPLAY — Iniciar automáticamente la reproducción cardíaca

**Status:** complete
**Delivery:** recorded
**From agent:** codex:1b0bf139
**To agent:** not offered
**Task version:** 2
**Expires:** not set
**Branch:** unknown

## What changed

El reproductor cardíaco comienza automáticamente al abrirlo, después de cargar las primeras muestras. Se conserva pausa, repetición y velocidad; el temporizador no avanza antes de tener datos.

## Reported outcome

_Not reported_

## Changed files

- `frontend/src/components/CardiacPanel.tsx`

## Tests run

- `npm run build: TypeScript y Vite pasaron`
- `Playwright Firefox: autoplay=true y paused=true; comprobado avance de cursor y detención tras Pausa`
- `prek run frontend-format-check --files frontend/src/components/CardiacPanel.tsx: passed`
- `git diff --check passed`

## Assumptions

_None_

## Decisions

_None_

## Known risks

_None_

## Guardrails checked

_None_

## Needs review from

_None_

## Next steps

_None_
