# Plan: Migración Angular 21 → 22

- **Fecha:** 2026-09-13
- **Herramienta/Modelo:** opencode (opencode-go/glm-5.3-flash)
- **Estado:** **planned** — aprobado para documentación; NO ejecutar sin nueva aprobación explícita.
- **Alcance acordado:** upgrade + Vitest + modernización completa, documentado por adelantado. El proyecto permanece en Angular 21.2.23 (LTS hasta 2027-05-19).

## Punto de partida (verificado 2026-09-13)

- Angular 21.2.23 + TypeScript 5.9.3, Karma/Jasmine (181 tests verdes), Cypress E2E.
- pnpm 10.17.1 anclado vía `packageManager` (PR #251); CI con pnpm 10 / Node 22.
- SonarCloud gate: coverage ≥ 80% lines / ≥ 80% branches (actual: 96.98% / 100%).
- Motivo inicial del plan: warnings de Vite/Rolldown (`optimizeDeps.esbuildOptions`, `envFile`, `esbuild`/`oxc`) en `pnpm start`, emitidos por `@angular/build` 21.2.24 y esperable que desaparezcan con v22.

## Contexto de versiones

- Angular 22 (junio 2026) es la versión **activa**; 21 y 20 en LTS; 19 y anteriores EOL.
- `ng update` solo admite **un salto de major por ejecución**: desde 21 es una única hop.
- **TS ≥ 6.0 requerido** en v22 (drop de < 6.0); nuestra base es TS 5.9.3.

## Breaking changes relevantes a este codebase

| Cambio v22 | Impacto aquí | Tratamiento |
|---|---|---|
| TS 6.0 requerido | Alto: subimos de 5.9.3 | `ng update` + verificar compat de `angular-eslint`/`typescript-eslint` |
| OnPush pasa a default (`Default` renombrado a `Eager`) | Bajo: el código legacy casi no declara `changeDetection` | Schematic añade `changeDetection: ChangeDetectionStrategy.Eager` explícito |
| HTTP usa Fetch por defecto; `withFetch` deprecado; upload progress requiere `withXhr` | Medio: `provideHttpClient` en `main.ts` | Schematic añade `withXhr()` automáticamente |
| Router: `paramsInheritanceStrategy` → `'always'`; `CanMatchFn` con 3er parámetro `currentSnapshot` | Bajo: no se usan en rutas actuales | Verificar `app-routing.module.ts` |
| `strictTemplates` activado por defecto (deprecado en tsconfig) | Nulo: ya habilitado | Verificar tsconfig, quitar redundancia si procede |
| Karma deprecado → Vitest | Medio: 181 specs + coverage | Fase 2 construye esto |
| `@angular-devkit/build-angular` (webpack builders) deprecados | Nulo: ya usamos application builder | — |
| Compiler estricto: `data-*` dejan de bind inputs/outputs; selectores duplicados lanzan error; `in` variables en templates | Bajo | Atrapado por build AOT/tests |
| Hammer.js removido; `getAngularLib`/`setAngularLib` removidos | Nulo | No se usan |
| `min`/`max` validators dejan de aceptar strings | Bajo self-contained | Revisar forms si aplica |

## Fase 1 — Upgrade 21 → 22

1. Rama `feature/angular-22` con baseline verde (`pnpm run verify`: 181 tests, build, 0 vulns).
2. `ng update @angular/cli@22 @angular/core@22` (permite dirty tree con schematics; ejecutar con pnpm 10).
3. Ajustar deps de soporte: TS 6.x, `@angular-eslint` 22 (cuando exista release), revisar `eslint.config.js`.
4. Verificación: build AOT (gate `pnpm run build`), 181 tests, `pnpm audit --prod` = 0.
- **Riesgos:** compat TS6/eslint; nuevos diagnostics del compiler atrapables por build/tests.

## Fase 2 — Karma → Vitest

1. Migración oficial `migrate-karma-to-vitest` (deps + config `angular.json`).
2. `refactor-jasmine-vitest` para convertir los specs; soporte `fakeAsync` vía `zone.js/plugins/vitest-patch` (polyfill del target `test`).
3. Actualizar scripts (`pnpm test`, `test-headless`, `test-headless-cc`) y el flujo de coverage para el gate Sonar (paths c8/nyc → Vitest coverage).
4. Retirar Karma/Jasmine; mantener Cypress solo como **E2E** (el component-testing de Cypress ya estaba roto en CI con el application builder).
- **Riesgo principal:** retoques manuales en specs convertidos; es la fase más laboriosa.

## Fase 3 — Modernización (PRs incrementales e independientes)

1. Componentes a idioma moderno: `input()`/`output()`/`computed()`/`inject()`, control flow nativo `@if/@for/@switch`, `host` object, bindings de class/style en vez de `ngClass`/`ngStyle` (reglas en `.agents/best-practices.md`).
2. Datos asíncronos con `resource()` / `httpResource()` (estables en v22) donde encaje en los servicios RxJS actuales.
3. **Zoneless** (estable en v22): eliminar `zone.js`, `provideZonelessChangeDetection()`; previa revisión de specs dependientes de zone.
4. Oportunista: `@Service()` en servicios nuevos; `@boundary` cuando esté disponible.

## Fase 4 — CI, docs y cierre

1. Workflows: cache keys, revisar/retirar job `component-tests` (roto con `|| exit 0`), audit gate.
2. Actualizar README/AGENTS.md/DOCS_INDEX.md (versiones, comandos, reglas de testing).
3. Verificación final: `pnpm run verify` + `pnpm run cypress:run` (dev server arriba, mocks de `:8080` vía `cy.intercept`).

## Criterios de aceptación

- `ng version` → Angular 22.x, TS 6.x.
- 100% de los specs en Vitest, verdes; Sonar ≥ 80% lines/branches.
- `pnpm audit --prod` = 0 vulnerabilidades.
- Sin warnings Vite/Rolldown en `pnpm start` (motivo original del plan).
- E2E Cypress en verde; lockfile sin mutaciones al ejecutar scripts.
- Branch policy: todo por PR (squash merge) — nada directo a `main`.

## Decisiones abiertas (necesarias antes de ejecutar)

- **Timing:** tras el cierre del ciclo de entregas (TFG), no en caliente; límite duro: fin de LTS 21 (mayo 2027).
- ¿Ejecutar Fases 2–4 juntas o PRs separados por fase? (recomendado: separados).
