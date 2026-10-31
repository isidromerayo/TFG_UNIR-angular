# Proposal

## Why

`TFG_UNIR-angular` sigue en Angular 21.2.25 + TypeScript 5.9.3. Angular 22 (junio 2026) es la
versión activa y el ecosistema ya gira alrededor de ella: `@sweetalert2/ngx-sweetalert2@14` declara
peer hasta `^21.0.0`, `@cypress/schematic@6` exige `cypress ^16`, `@angular-devkit/build-angular`
está oficialmente deprecado en v22 y Angular 22 trae `@babel/core` 8, que choca con el override
`<8` que el repo mantiene por la toolchain de tests. Cada semana que se retrasa el salto aumenta la
distancia de peers y el coste de reconstruir el árbol de dependencias.

La auditoría del código muestra que **la aplicación casi no se ve afectada** por los breaking
changes de v22: no hay `ComponentFactoryResolver`, `provideRoutes`, `CanMatchFn`, inputs/outputs
duplicados, bindings `data-*`, rutas anidadas ni validadores `min`/`max` con strings. El riesgo real
está en el tooling (TypeScript 6, Babel 8, Cypress 16, builders), no en el código de features.

## What Changes

- **Angular 22.2.x + TypeScript 6.0.3** (rango obligatorio `>=6.0 <6.1`; el `latest` de npm, 7.x,
  no está soportado). **BREAKING** para el toolchain: Node mínimo `^22.22.3`.
- **Builders a `@angular/build`**: `application`, `dev-server`, `karma` y `extract-i18n` dejan de
  depender de `@angular-devkit/build-angular`, deprecado, y se añade `istanbul-lib-instrument`
  como devDependency (ahora peer opcional para cobertura con Karma).
- **Cadena Cypress 15 → 16**: `cypress@^16.2.1`, `@cypress/schematic@^6`, `@cypress/angular@^5`,
  `@cypress/webpack-dev-server@^6`, `@cypress/code-coverage@^4.1.2`; `cypress.config.ts` pasa de
  `env` a `expose` porque Cypress 16 eliminó `Cypress.env()`.
- **`@sweetalert2/ngx-sweetalert2@^15.0.1`**, primera versión con peer `^22.0.0`.
- **Limpieza de dependencias deprecadas**: se eliminan `@angular/animations` y
  `@angular/platform-browser-dynamic` (deprecados en v22 y sin ningún import en `src/`).
- **HttpClient explícito → implícito**: se retira `provideHttpClient(withInterceptorsFromDi())` de
  `src/main.ts` (redundante desde v21 y sin interceptores registrados) y se acepta el backend
  **Fetch** por defecto de v22, retirando el `withXhr()` que añade la migración automática.
- **CI**: Node fijado a `22.22.3` en `node.js.yml`, `tests.yml` y `security.yml`; se deja de
  instalar `@cypress/angular`/`@cypress/webpack-dev-server` en caliente y se actualiza la cache key
  de Cypress.
- **Artefactos de migración**: `changeDetection: ChangeDetectionStrategy.Eager` en los 15
  componentes (OnPush pasa a ser el default) y `$safeNavigationMigration(...)` en las 7 expresiones
  con optional chaining.

Fuera de alcance: Vitest, zoneless, signals/`resource()`, control flow nativo, `@Service()`,
borrado de `src/app/app.module.ts`, Cypress component testing y cualquier cambio funcional.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

(none)

No hay cambios de comportamiento observable: los 181 tests, las rutas, los servicios y el contrato
con el backend (`localhost:8080/api`) se mantienen idénticos. Por eso el cambio se marca con
`skip_specs: true` en `.openspec.yaml` en lugar de inventar un requisito de toolchain.

## Impact

- **Código**: `package.json`, `pnpm-lock.yaml`, `angular.json`, `karma.conf.js`, `cypress.config.ts`,
  `src/main.ts`, 15 componentes (`changeDetection`) y 7 expresiones de plantilla.
- **CI**: los tres workflows (`node.js.yml`, `tests.yml`, `security.yml`).
- **Dependencias**: Angular 22.2.x, TypeScript 6.0.3, angular-eslint 22, Cypress 16, ngx-sweetalert2
  15, `@angular/build`, `istanbul-lib-instrument`; resolución del conflicto `@babel/core` 7/8.
- **Riesgos**: Babel 8 vs override `<8` (bloqueante potencial), builder Karma basado en esbuild,
  backend Fetch, Cypress 16 HTTP/2. Todos cubiertos por `pnpm run verify` y el E2E de regresión.
- **Sin impacto** en datos, API ni infraestructura. Rollback = revert del squash-merge.
