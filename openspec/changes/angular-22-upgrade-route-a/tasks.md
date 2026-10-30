# Tasks

## 1. Preparación y spike de Babel

- [ ] 1.1 Crear rama `feature/angular-22` desde `main` limpio y confirmar baseline con `pnpm install --frozen-lockfile && pnpm run verify` (181 tests, build y audit en verde).
- [ ] 1.2 En un worktree desechable, probar la variante de overrides `"@babel/core": ">=7.29.6"` (sin tope) y comprobar que `pnpm run build` y `pnpm run test-headless` pasan con `@babel/core` 8.
- [ ] 1.3 Si la variante global falla, probar overrides con scope por padre (`"@cypress/code-coverage>@babel/core"` e `"istanbul-lib-instrument>@babel/core"` a `">=7.29.6 <8"`) y verificar de nuevo build + tests.
- [ ] 1.4 Registrar la variante elegida en `design.md` (sección Decisions) y descartar el worktree; si ninguna variante compila, detener la iteración y reportar el bloqueo.

## 2. Upgrade de Angular y TypeScript

- [ ] 2.1 Ejecutar `pnpm exec ng update @angular/core@22 @angular/cli@22` y verificar que `package.json` y `pnpm-lock.yaml` quedan en 22.2.x sin conflictos de peer.
- [ ] 2.2 Fijar TypeScript con `pnpm up 'typescript@~6.0.3'` y confirmar que `pnpm exec tsc --version` devuelve 6.0.x.
- [ ] 2.3 Subir `angular-eslint` a `^22.6.0` y verificar `pnpm run lint` sin errores nuevos (los warnings siguen permitidos).
- [ ] 2.4 Revisar el diff de las migraciones automáticas: `changeDetection: ChangeDetectionStrategy.Eager` en los 15 componentes y `$safeNavigationMigration(...)` en las 7 expresiones con optional chaining; verificar que `pnpm run build` compila.
- [ ] 2.5 Revisar a mano `src/app/components/registro/registro.component.html` (6 de las 7 expresiones) y confirmar que los `$safeNavigationMigration(...)` no alteran el mensaje de validación mostrado.
- [ ] 2.6 Ejecutar `pnpm run test-headless` y confirmar 181/181 en verde antes de tocar dependencias satélite.

## 3. Ecosistema de dependencias

- [ ] 3.1 Subir `@sweetalert2/ngx-sweetalert2` a `^15.0.1` y verificar que `pnpm install` no reporta peer inválido contra `@angular/core@22`.
- [ ] 3.2 Subir la cadena Cypress completa (`cypress@^16.2.1`, `@cypress/schematic@^6`, `@cypress/angular@^5`, `@cypress/webpack-dev-server@^6`, `@cypress/code-coverage@^4.1.2`) y verificar `pnpm exec cypress version`.
- [ ] 3.3 Migrar `cypress.config.ts` de `env` a `expose` y verificar que `CYPRESS_COVERAGE=true` sigue llegando a la config (sin `Cypress.env()` en el repo).
- [ ] 3.4 Ejecutar `pnpm start` en una terminal y `pnpm run cypress:run` en otra; confirmar que `cypress/e2e/spec.cy.ts` pasa, incluido el bloque de regresión de render asíncrono.

## 4. Builders `@angular/build` y Karma

- [ ] 4.1 Cambiar en `angular.json` los cuatro builders a `@angular/build:{application,dev-server,karma,extract-i18n}` y verificar `pnpm run build`.
- [ ] 4.2 En `karma.conf.js`, dejar `frameworks: ['jasmine']` y quitar el `require('@angular-devkit/build-angular/plugins/karma')`; verificar que `pnpm run test-headless` no emite el aviso de framework incompatible.
- [ ] 4.3 Sustituir la devDependency `@angular-devkit/build-angular` por `@angular/build` y añadir `istanbul-lib-instrument@^6.0.3`; verificar `pnpm install --frozen-lockfile` y `pnpm run test-headless-cc` con `coverage/frontend-angular/lcov.info` generado.
- [ ] 4.4 Confirmar que `codeCoverageExclude` (`src/app/model/**`, `src/app/utils/constants.ts`) sigue aplicándose en el informe de cobertura.

## 5. Limpieza de HttpClient y dependencias deprecadas

- [ ] 5.1 Retirar `provideHttpClient(...)` (y el `withXhr()` añadido por la migración) de `src/main.ts`; verificar que `pnpm run test-headless` sigue en 181/181.
- [ ] 5.2 Eliminar `@angular/animations` y `@angular/platform-browser-dynamic` de `dependencies` y verificar `pnpm run build` y `pnpm run lint`.
- [ ] 5.3 Verificar con `grep -rn "reportProgress\|reportUploadProgress" src` que no hay usos incompatibles con el backend Fetch y ejecutar de nuevo el E2E de carrito/acceso.

## 6. CI y documentación

- [ ] 6.1 Fijar `node-version: '22.22.3'` en `.github/workflows/node.js.yml`, `tests.yml` y `security.yml` y verificar que los tres YAML son válidos (`python3 -c "import yaml,sys; yaml.safe_load(...)"`).
- [ ] 6.2 Quitar de `tests.yml` el paso `pnpm add -D @cypress/angular @cypress/webpack-dev-server` y actualizar la cache key `cypress-v15.9.0` a `v16`; verificar que el job `e2e-tests` solo consume dependencias del lockfile.
- [ ] 6.3 Actualizar `AGENTS.md` (versiones, comandos, nota de builder/Fetch) y `README.md` (Angular 22 / TS 6 / Node 22.22.3); verificar que las versiones citadas coinciden con `package.json`.
- [ ] 6.4 Anotar en `docs/plans/2026-09-13-angular-22-migration.md` que la Fase 1 se ejecuta mediante este cambio y que las fases 2–6 siguen pendientes.
- [ ] 6.5 Ejecutar `pnpm security:accepted` y confirmar que ningún advisory aceptado tiene parche pendiente de aplicar.

## 7. Verificación de integración

- [ ] 7.1 Ejecutar `pnpm run verify` completo (181 tests, build, `pnpm audit --prod` = 0) sobre el árbol final.
- [ ] 7.2 Ejecutar `pnpm run test-headless-cc` y confirmar branches ≥ 80 % en `coverage/frontend-angular/`.
- [ ] 7.3 Confirmar `node -e "..."`/`pnpm exec ng version` con Angular 22.2.x, TypeScript 6.0.x y Node 22.22.3.
- [ ] 7.4 Abrir la PR `feature/angular-22` con Conventional Commits y comprobar CI en verde (unit, e2e, security, Sonar).

## Workflow follow-up

- Archivar el cambio en OpenSpec tras el merge y la verificación en `main`.
