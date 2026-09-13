# Plan: Migración Angular 21 → 22

- **Fecha:** 2026-09-13 (revisado y corregido el mismo día tras revisión)
- **Herramienta/Modelo:** opencode (opencode-go/glm-5.3-flash)
- **Estado:** **planned** — aprobado para documentación; NO ejecutar sin nueva aprobación explícita.
- **Alcance acordado:** upgrade + Vitest + migración del estado asíncrono + zoneless + modernización, por fases con PRs independientes. El proyecto permanece en Angular 21.2.23 (LTS hasta 2027-05-19).

## Punto de partida (verificado 2026-09-13)

- Angular 21.2.23 + TypeScript 5.9.3, Karma/Jasmine (181 tests verdes), Cypress E2E.
- pnpm 10.17.1 anclado vía `packageManager` (PR #251); CI con pnpm 10 / Node 22.
- SonarCloud gate: coverage ≥ 80% lines / ≥ 80% branches (actual: 96.98% / 100%).
- `main.ts` arranca con `provideZoneChangeDetection({ eventCoalescing: true })`: **zona explícita**, introducida en PR #252 tras diagnosticar el bug de `NoopNgZone` (build Vite/rolldown de `@angular/build` 21.2.24 no garantizaba la carga de zone.js al bootstrap → pantallas congeladas). Existe test de regresión E2E (`spec.cy.ts`, bloque "Render de datos asíncronos").
- Motivo original del plan: warnings de Vite/Rolldown (`optimizeDeps.esbuildOptions`, `envFile`, `esbuild`/`oxc`) en `pnpm start`, emitidos por `@angular/build` 21.2.24. **No se asume** que desaparecerán con v22; queda como criterio a verificar.

## Contexto de versiones (matriz oficial, angular.dev/reference/versions)

- Angular 22 (junio 2026) es la versión **activa**; 21 y 20 en LTS; 19 y anteriores EOL.
- `ng update` solo admite **un salto de major por ejecución**: desde 21 es una única hop.
- **TypeScript 22: `>= 6.0.0 < 6.1.0`** (obligatorio; googleamos de 5.9.3).
- **Node (para Angular 22): `^22.22.3 || ^24.15.0 || ^26.0.0`** — el Node 22 local cumple si es ≥ 22.22.3; **CI debe fijar como mínimo 22.22.3** (comprobar `.github/workflows/node.js.yml`).
- **RxJS: `^6.5.3 || ^7.4.0`** — nuestro `~7.8.0` cumple, sin cambios previstos.
- Zoneless: **ya es el default del framework desde Angular 21+** (docs oficiales): nuestro `provideZoneChangeDetection` es una **compatibilidad explícita** a mantener hasta completar la Fase 4.

## Breaking changes relevantes a este codebase

| Cambio v22 | Impacto aquí | Tratamiento |
|---|---|---|
| TS 6.0 requerido | Alto: subimos de 5.9.3 | `ng update` + verificar compat de `angular-eslint`/`typescript-eslint` |
| OnPush pasa a default (`Default` renombrado a `Eager`) | Bajo: el código legacy casi no declara `changeDetection` | Schematic añade `changeDetection: ChangeDetectionStrategy.Eager` explícito; revisarlos al modernizar (Fase 5) |
| HTTP usa Fetch por defecto; `withFetch` deprecado; upload progress requiere `withXhr` | Medio: `provideHttpClient` en `main.ts` | Schematic añade `withXhr()` automáticamente; verificar tras el update |
| Router: `paramsInheritanceStrategy` → `'always'`; `CanMatchFn` con 3er parámetro `currentSnapshot` | Bajo: no se usan en rutas actuales | Verificar `app-routing.module.ts` |
| `strictTemplates` activado por defecto (deprecado en tsconfig) | Nulo: ya habilitado | Verificar tsconfig, quitar redundancia si procede |
| Karma deprecado → Vitest | Medio: 181 specs + coverage | Fase 2 construye esto (spike primero, ver abajo) |
| `@angular-devkit/build-angular` (webpack builders) deprecados | Nulo: ya usamos application builder | — |
| Compiler estricto: `data-*` dejan de bind inputs/outputs; selectores duplicados lanzan error; `in` variables en templates | Bajo | Atrapado por build AOT/tests |
| Hammer.js removido; `getAngularLib`/`setAngularLib` removidos | Nulo | No se usan |
| `min`/`max` validators dejan de aceptar strings | Bajo self-contained | Revisar forms si aplica |
| **Zoneless es default desde v21** | **Alto para nuestra arquitectura actual** | NO activar hasta Fase 4 (ver secuencia) |

## Riesgo crítico identificado en revisión (2026-09-13)

**Quitar zone.js / activar zoneless antes de migrar el estado asíncrono reproduciría el bug resuelto** en PR #252 (backend responde 200, `next` asigna, la vista no refresca). El codebase actual asigna datos desde `subscribe` a propiedades ordinarias que las plantillas leen directamente (p. ej. `curso.service.ts` → `CursoComponent.curso`), que **solo actualizan la vista con zone o con una notificación manual**. Por eso:

1. `provideZoneChangeDetection` se mantiene en todas las fases hasta que la Fase 4 lo retire **voluntariamente y en su propia PR**.
2. La Fase 3 (migración del estado asíncrono a signals/`AsyncPipe`/`markForCheck`) es un **prerrequisito bloqueante** de la Fase 4 (zoneless).
3. El test de regresión E2E existente debe seguir pasando en cada fase (home pinta curso destacado asíncrono; detalle pinta título).

## Fase 1 — Upgrade mecánico 21 → 22 (sin tocar zone)

1. Rama `feature/angular-22` con baseline verde (`pnpm run verify`: 181 tests, build, 0 vulns).
2. `ng update @angular/cli@22 @angular/core@22` (ejecutar con pnpm 10; schematics automáticos).
3. Ajustar deps de soporte: TS `>=6.0 <6.1`, `@angular-eslint` 22 (cuando exista release), revisar `eslint.config.js`.
4. Verificar Node CI ≥ 22.22.3 y actualizar `node.js.yml` si procede.
5. Verificación: build AOT (gate `pnpm run build`), 181 tests Karma intactos, `pnpm audit --prod` = 0, `pnpm run cypress:run` (spec.cy.ts completo, incl. bloque de regresión de render).
6. Medir si los warnings Vite/Rolldown desaparecieron; solo documentar el resultado, se acepta que persistan si es upstream.
- **Riesgos:** compat TS6/eslint; nuevos diagnostics del compiler atrapables por build/tests.
- **Rollback:** revert del PR (squash) — no hay migraciones de datos.

## Fase 2 — Spike Karma → Vitest (verificar antes de comprometer)

1. Spike en rama desechable: correr `ng generate`/CLI oficial v22 para la migración de testing (`migrate-karma-to-vitest` + `refactor-jasmine-vitest` según anuncio de v22) sobre una muestra pequeña (p. ej. `auth.service.spec.ts`, `curso.service.spec.ts`) y validar el flujo completo.
2. Decisiones a validar en el spike antes de tocar `main`:
   - ¿El CLI disponible en nuestra versión realmente expone esas migraciones? (si no, migración manual de config).
   - Coverage: ajustar `angular.json` + scripts (`test-headless*`) + formato que Sonar ingiere (paths c8/v8 → lcov).
   - `fakeAsync`/`zone-patch` del target `test` para specs dependientes de zone.
3. Solo si el spike es viable: PR que convierta los 181 specs; CI parity (gate Sonar ≥ 80/80). Cypress queda **solo E2E** (el component-testing ya estaba roto en CI).
4. Criterio: 181/181 en Vitest + coverage equivalente **antes** de retirar Karma del lockfile.
- **Riesgo principal:** retoques manuales en specs convertidos; es la fase más laboriosa. El spike limita el daño.

## Fase 3 — Migración del estado asíncrono (prerrequisito de zoneless)

1. Inventario de actualizaciones de estado que alimentan plantillas: `subscribe(... => this.x = ...)` en componentes y servicios, callbacks async, form observables (autocompletar con lista: buscar `\.subscribe\(` en `src/app/components`).
2. Convertir por componente/PR:
   - Preferente: signals (`signal`/`computed`) o `toSignal` en la plantilla.
   - Alternativa válida durante la transición: `AsyncPipe` o `ChangeDetectorRef.markForCheck()`.
3. Criterios por PR: render asíncrono verificado **sin** `fixture.detectChanges()` manual en el spec nuevo (según guía de zoneless de Angular) + el E2E de regresión en verde + Sonar ≥ 80/80.
- Nota: la migración puede hacerse **antes** del upgrade (en v21) — se estima más seguro post-upgrade para no mezclar cambios; opcional pero recomendable encadenarla en cuanto la Fase 1 esté verde.

## Fase 4 — Zoneless (solo cuando la Fase 3 esté completa)

1. Quitar `provideZoneChangeDetection` del bootstrap; añadir `provideZonelessChangeDetection()`.
2. Eliminar `zone.js` de `polyfills` (`angular.json`, `build` y `test`) y **desinstalar** la dependencia de `package.json`.
3. Auditoría: no debe existir `NgZone.onMicrotaskEmpty/onStable/isStable` en el codebase (grep); revisar SSR (no aplica, no hay SSR).
4. Activar el chequeo de debug `provideCheckNoChangesConfig({exhaustive: true, interval: N})` durante la fase de estabilización — ojo: el API está en `developerPreview`; usarlo como ayuda de auditoría, no como gate de CI (puede cambiar entre minors).
5. Gates: suite completa + E2E (incluido el de regresión, que captura exactamente esta clase de bug) + Sonar.
- **Riesgo principal:** regresión de "pantalla congelada" — cubierta por el E2E de regresión y el inventario de la Fase 3.

## Fase 5 — Modernización (PRs incrementales e independientes)

1. Componentes a idioma moderno: `input()`/`output()`/`computed()`/`inject()`, control flow nativo `@if/@for/@switch`, `host` object, bindings de class/style en vez de `ngClass`/`ngStyle` (reglas en `.agents/best-practices.md`); revisar los `Eager` explícitos añadidos por el schematic de la Fase 1.
2. Datos asíncronos con `resource()` / `httpResource()` (estables en v22) donde encaje en los servicios RxJS actuales.
3. Oportunista: `@Service()` en servicios nuevos; `@boundary` cuando esté disponible.
- Cada ítem = PR independiente con Sonar en verde.

## Fase 6 — CI, docs y cierre

1. Workflows: Node ≥ 22.22.3, cache keys, revisar/retirar job `component-tests` (roto con `|| exit 0`), audit gate.
2. Actualizar README/AGENTS.md/DOCS_INDEX.md (versiones, comandos, reglas de testing incl. Vitest, zoneless).
3. Verificación final: `pnpm run verify` + `pnpm run cypress:run` (dev server arriba, mocks de `:8080` vía `cy.intercept`).

## Criterios de aceptación

- `ng version` → Angular 22.x, TS `>=6.0 <6.1`, Node CI ≥ 22.22.3.
- 100% de los specs en Vitest, verdes; Sonar ≥ 80% lines/branches.
- **Render asíncrono verificado**: los datos HTTP actualizan el DOM sin `fixture.detectChanges()` forzado (zona en Fases 1–3; zoneless desde la Fase 4); E2E de regresión `spec.cy.ts` en verde en todas las fases.
- Warnings Vite/Rolldown en `pnpm start`: **medir y documentar el resultado tras la Fase 1** (mejora esperada, no garantía).
- `pnpm audit --prod` = 0 vulnerabilidades; lockfile sin mutaciones al ejecutar scripts (pnpm anclado).
- E2E Cypress en verde; zona explícita preservada hasta la Fase 4; **después** de ella, cero referencias a zone en `angular.json`/`package.json`.
- Branch policy: todo por PR (squash merge) — nada directo a `main`; una PR por fase.

## Fases fuera de orden / dependencias

```
F1 (upgrade mecánico)  ──┬─→ F2 (spike Vitest)  ──→ F2′ (migración completa)
                         ├─→ F3 (estado asíncrono) ──→ F4 (zoneless)
                         └─→ F5 (modernización)  [tras F4]
F6 (CI/docs)            cierra todo
```

## Decisiones abiertas (necesarias antes de ejecutar)

- **Timing:** tras el cierre del ciclo de entregas (TFG), no en caliente; límite duro: fin de LTS 21 (mayo 2027).
- Ejecutar Fases 2/3 en paralelo en ramas separadas vs. secuencial (recomendado: secuencial, La Fase 3 puede empezarse justo tras la Fase 1 sin esperar al spike de Vitest).
- ¿Mantener Cypress component testing roto tal cual, o retirar los scripts/jobs al ejecutar esta migración? (decisión ya establecida: solo E2E; retirar esa deuda en la Fase 6).
