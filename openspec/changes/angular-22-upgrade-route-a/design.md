# Design

## Context

Ver `proposal.md` para la motivación. Estado verificado del repo (2026-10-30):

- Angular 21.2.25, CLI/build-angular 21.2.27, TypeScript 5.9.3, pnpm 10.17.1, Node local 22.23.2.
- 181 `it()` en 27 specs sobre Karma/Jasmine; Cypress 15.21.1 solo E2E (el component testing ya
  está roto en CI y se ignora con `|| exit 0`).
- 15 componentes, ninguno declara `changeDetection`; cero `@Input`/`@Output`; rutas planas.
- `src/main.ts` provee `provideHttpClient(withInterceptorsFromDi())` sin interceptores.
- `@angular/animations` y `@angular/platform-browser-dynamic` figuran en `dependencies` pero no se
  importan en `src/`.
- `pnpm.overrides` fija `@babel/core` a `>=7.29.6 <8` y hay devDependency directa `@babel/core@7.29.7`
  porque Babel 8 se consideró incompatible con la toolchain de tests (plan 2026-09-12).
- `tsconfig.json` ya tiene `strictTemplates: true`; `zone.js` es explícito y deliberado (PR #252).

## Goals / Non-Goals

**Goals:**

- Dejar el repo en Angular 22.2.x + TypeScript 6.0.3 con **comportamiento idéntico**.
- Eliminar la dependencia de paquetes deprecados (`@angular-devkit/build-angular`,
  `@angular/platform-browser-dynamic`, `@angular/animations`).
- Resolver el conflicto Babel 7/8 con una configuración de `pnpm.overrides` explícita y reproducible.
- Un único PR revisable, con commits separables para poder revertir el builder de test de forma
  aislada.

**Non-Goals:**

- Migrar a Vitest o a zoneless (fases posteriores del plan 2026-09-13).
- Modernizar componentes (signals, control flow nativo, `@Service()`).
- Arreglar o retirar Cypress component testing.
- Cambiar rutas, servicios, contrato con el backend o el modelo de datos.

## Decisions

1. **Mantener Karma/Jasmine y zone.js en esta iteración.**
   v22 sigue soportando Karma (`@angular/build:karma`, peer `karma ^6.4`) y `unit-test` admite
   `runner: "karma"`. Reescribir 181 specs y activar zoneless a la vez que se cambia de major
   multiplicaría el espacio de fallos. *Alternativa descartada*: hacer F1+F2 del plan de septiembre
   en una sola PR.

2. **Migrar los builders a `@angular/build`.**
   `@angular-devkit/build-angular` está deprecado en v22 y su builder `application` ya delega en
   `@angular/build`. Migrar elimina el aviso de deprecación y el árbol webpack que no usamos.
   Consecuencias: `karma.conf.js` pierde el framework/plugin `@angular-devkit/build-angular` (el
   builder nuevo lo filtra y avisa) y la cobertura pasa a necesitar `istanbul-lib-instrument` como
   devDependency. *Alternativa descartada*: quedarse en `build-angular` 22 (funciona, pero nace
   deprecado).

3. **Babel: overrides con scope por padre, no un pin global.**
   Angular 22 depende de `@babel/core` 8.0.5; `@cypress/code-coverage` e `istanbul-lib-instrument`
   declaran `^7`. La decisión se toma en un **spike previo** con tres variantes (global `>=7.29.6`,
   scoped `"<padre>>@babel/core": ">=7.29.6 <8"`, y `<8` global) y gana la primera que pase
   `pnpm run build` y `pnpm run test-headless`. Preferencia: scoped, para que Angular reciba 8 y la
   instrumentación de cobertura siga en 7. *Por qué no un pin global*: obliga a una de las dos
   toolchains a usar una major que no declara.

4. **Fetch como backend HTTP.**
   La migración de v22 añade `withXhr()` para preservar XHR. Aquí no hay `reportProgress` ni
   subidas con seguimiento, y `carrito.service.ts` solo fija `Content-Type: text/uri-list`, que Fetch
   soporta. Se retira `withXhr()` y también `provideHttpClient(...)` completo en `main.ts`
   (redundante desde v21 al no haber interceptores). *Alternativa descartada*: conservar XHR por
   inercia; mantendría una ruta no probada en v22 sin beneficio.

5. **OnPush: aceptar la migración automática.**
   El schematic añade `ChangeDetectionStrategy.Eager` a los 15 componentes. Es ruido de diff, pero
   preserva el comportamiento actual y evita mezclar el upgrade con la modernización. Los `Eager`
   se revisarán al migrar a signals.

6. **Cypress 16 en bloque con su ecosistema.**
   `@cypress/schematic@6` exige `cypress ^16` y Cypress 16 eliminó `Cypress.env()`. Se sube toda la
   cadena a la vez (`cypress`, `schematic`, `@cypress/angular`, `webpack-dev-server`,
   `code-coverage`) y se migra `env` → `expose` en `cypress.config.ts`. Se elige `^16.2.1` y no
   16.0.0 por la regresión de cuelgue en Chrome.

7. **TypeScript 6.0.3 exacto, no `latest`.**
   El rango soportado por Angular 22 y `@angular/build` es `>=6.0 <6.1`; npm publica 7.0.2 como
   `latest`. Se usa `pnpm up 'typescript@~6.0.3'`. `typescript-eslint` 8.72 declara `<6.1.0`, así
   que no hay que forzar eslint.

8. **CI con Node fijado y Cypress declarado en `package.json`.**
   `tests.yml` instala `@cypress/angular` y `@cypress/webpack-dev-server` con `pnpm add -D` sin
   versión; eso hace el job no reproducible. Se declaran como devDependencies y el workflow solo
   las consume. Node se fija a `22.22.3` para cumplir el engine de `@angular/cli` 22.

## Risks / Trade-offs

- [Babel 8 incompatible con `@angular/build` 22] → spike previo con go/no-go; si ninguna variante
  compila, se para la iteración antes de tocar `main`.
- [El builder Karma basado en esbuild rompe specs que hoy pasan] → commit aislado solo para el
  cambio de builder, verificado con `test-headless` y `test-headless-cc` (lcov para Sonar).
- [Fetch cambia el comportamiento de alguna petición] → `carrito.service.spec.ts`,
  `auth.service.spec.ts` y el E2E con `cy.intercept` cubren las rutas reales.
- [Cypress 16 usa HTTP/2 por defecto y los `cy.intercept` dejan de ver tráfico] → el mock es de
  `localhost:8080` a nivel de aplicación; se valida `cypress/e2e/spec.cy.ts` completo.
- [`$safeNavigationMigration` altera expresiones] → revisión manual de las 7 ocurrencias (6 en
  `registro.component.html`).
- [Ruido de diff por `Eager` en 15 componentes] → aceptado; se limpia en la fase de modernización.

## Migration Plan

1. Spike Babel en rama desechable (go/no-go).
2. `feature/angular-22` desde `main` con baseline verde (`pnpm run verify`).
3. `pnpm exec ng update @angular/core@22 @angular/cli@22`; `pnpm up 'typescript@~6.0.3'`;
   angular-eslint 22.
4. Subida del ecosistema (ngx-sweetalert2, Cypress 16) y `cypress.config.ts` `env` → `expose`.
5. Commit aislado: builders a `@angular/build`, `karma.conf.js`, `istanbul-lib-instrument`.
6. Commit aislado: `main.ts` sin `provideHttpClient`/`withXhr`, eliminación de animaciones y
   `platform-browser-dynamic`.
7. CI: Node `22.22.3`, cache key de Cypress, quitar `pnpm add` en caliente.
8. Verificación completa y actualización de `AGENTS.md`/`README.md`; PR con Conventional Commits.

**Rollback**: revert del squash-merge. No hay migraciones de datos ni cambios de API.

## Open Questions

- Ninguna que afecte al alcance o a las tareas. La única incógnita (Babel) se resuelve en el spike
  del paso 1 y no cambia el plan, solo la configuración de `pnpm.overrides`.
