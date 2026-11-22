# 2026-11-22 — Lint type-aware con scope completo + typecheck de Cypress en `verify`

**Fecha:** 2026-11-22
**Herramienta / modelo:** OpenCode (Qwen3.8 Flash)
**Origen:** P0 del plan `~/.opencode/plan/2026-11-20-ci-contract-improvements.md` (iteración 2026-11-20):
el lint local no era type-aware y no cubría `cypress/**`, así que `no-unsafe-*`,
`no-floating-promises` y similares solo se descubrían vía anotaciones de Codacy
 tras push (el bucle de 4 pushes del incidente de registro).

## Estado

**done** (rama `ci/type-aware-lint`, PR abierta) — P0 parcial: quedan en el plan de CI el
snapshot OpenAPI + test de contrato, los `required_status_checks` de la ruleset y el gate de
`release.yml` (próximas iteraciones).

## Cambios

| Archivo | Cambio |
|---------|--------|
| `eslint.config.js` | `tseslint.configs.recommended` → `recommendedTypeChecked` + `stylisticTypeChecked` con `projectService: true`. `ignores`: `dist`, `coverage`, `reports`, `openspec`, `out-tsc`, `.angular`, `.husky-example`, `node_modules`, `src/assets/vendor/**` (el bootstrap vendor trae `eslint-disable` de plugins inexistentes) y `eslint.config.js`. Bloque `**/*.spec.ts` + `cypress/**` + `cypress.config.ts` con las reglas `unsafe-*`/`unbound-method`/`no-namespace` apagadas (el `any` del harness, no del diseño). Degradadas a `warn` las reglas de modernización sobre código heredado (`prefer-inject`, `no-inferrable-types`, template `prefer-control-flow`) y las `unsafe-*` en app, siguiendo la política "legacy vs new" de `AGENTS.md`. |
| `src/app/**` (7 ficheros) | Fixes reales de los errores que pilló el modo type-aware: 19 promesas flotantes (`Swal.fire`/`router.navigate`/`runInInjectionContext` → `void`) en guard, acceso, carrito, curso, header, registro y slider; `non-nullable-type-assertion-style` degradada a `warn` (las `as string` de `auth.service.ts` se quedan: el tool TypeScript de Codacy prohíbe `!` y el gate de PR cuenta cualquier severidad). |
| `cypress.config.ts` | `no-require-imports` silenciado in situ con razón (`@cypress/code-coverage/task` es CJS y se carga en el `setupNodeEvents` Node). |
| `package.json` | `lint` → `eslint .` (scope completo, como pedía el plan). `verify` → `test-headless && build && tsc -p tsconfig.cypress.json --noEmit && audit --prod`. |
| `tsconfig.cypress.json` | Typecheck ampliado a `cypress/e2e/**` + `support/e2e.ts` + `commands.ts` y `src` **sin specs** (los specs las define Karma con `tsconfig.spec.json`). Excluye `cypress/component/**` y `support/component.ts`: el component testing está deshabilitado en Angular 22 y `@cypress/angular` ni siquiera está instalado — **este comando ya fallaba en `main`**, el plan lo pedía en `verify` y ahora pasa. `types` añade `jasmine`. |
| `AGENTS.md` | Documentado el nuevo lint/verify y la decisión P2 ( abajo ). |

## Decisión P2: Codacy vs ESLint

El lint local es ahora type-aware y de repo completo, así que es la **fuente de verdad para los
hallazgos de tipo** (`no-unsafe-*`, floating promises, etc.). Codacy mantiene sus patrones propios
(no reproducibles con ESLint del repo). No se desactiva nada en Codacy en esta iteración; si sus
anotaciones de tipos duplican las locales, se cambiará su tool de TypeScript a `Use config file`.

## Verificación (ejecutada en esta rama)

- `pnpm exec eslint .` → **0 errores**, 243 warnings (todos legacy: `any` heredado de
  `get<any>`/fixtures, `prefer-inject`/control-flow, directives deshabilitados huérfanos).
- `pnpm exec tsc -p tsconfig.cypress.json --noEmit` → limpio (en `main` fallaba con 16 errores).
- `pnpm run test-headless` → **184/184 SUCCESS**.
- `pnpm run build` → OK.

## Riesgo de solape

`registro.component.ts`, `acceso.component.ts` y `auth.service.ts` también se tocan en
`fix/auth-token-interceptor` (PR #308). Al fusionarse #308 primero, esta rama se rebasea sobre
`main` (hunks pequeños: `void` + `!` sobre líneas que #308 ya reescribe; se resuelven adoptando
la versión de #308 con los `void` aplicados).
