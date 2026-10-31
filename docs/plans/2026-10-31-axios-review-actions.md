# 2026-10-31 — Revisión de axios (eliminación de dependencia muerta)

**Fecha:** 2026-10-31
**Herramienta / modelo:** OpenCode (GLM-5.3-Flash)

## Objetivo

Eliminar `axios` del proyecto: el código fuente de Angular usa exclusivamente
`HttpClient` de Angular (`provideHttpClient` + `HttpTestingController` en tests),
por lo que la dependencia era código muerto (superficie de ataque y ruido en
audits/Dependabot sin uso real).

Contexto: revisión cruzada de axios en los tres frontends (Angular/React/Vue3).
React y Vue3 tienen sus propios PRs equivalentes (instancia compartida + bump a
axios ^1.21.0); este PR es el de limpieza en Angular.

## Cambios

- `package.json`: elimina `axios ^1.20.0` de `dependencies` (`pnpm remove axios`).
- `pnpm-lock.yaml`: regenerado; se retiran axios y 3 de sus dependencias transitivas.
- No se toca código fuente ni tests (cero importaciones de axios en `src/`).

## Deshabilitaciones / overrides

- axios no aparecía en `pnpm.auditConfig` ni en `pnpm.overrides`; no hay nada que
  retirar en esa línea.

## Verificación

- `pnpm install --frozen-lockfile` → OK (lockfile coherente tras el remove).
- `pnpm run test-headless` → 181/181 SUCCESS.
- `pnpm run build` → OK (bundle sin cambios relevantes).
- `pnpm audit` → "No known vulnerabilities found".

## Decisiones de diseño

- Eliminación completa en lugar de dejar la dependencia "por si acaso": el
  cliente HTTP de Angular (`HttpClient`) es el estándar del proyecto y madura;
  reintroducir axios sería un paso atrás en consistencia.
- Versión 1.21.0 de axios (última disponible) no aplica: la dependencia
  desaparece; los repos que la conservan (React, Vue3) suben a ^1.21.0.

## Estado

- **Planned** → ejecutado y verificado en la iteración 2026-10-31.
- PR: `chore/remove-axios-dep` (branch) → PR a `main` vía squash merge.
