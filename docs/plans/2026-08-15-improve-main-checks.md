# Plan de mejora de checks en flujo a `main`

**Fecha**: 2026-08-15
**Herramienta**: opencode (opencode/big-pickle)
**Estado**: En ejecución (PR `ci/improve-checks-main`)
**Rama de implementación**: `ci/improve-checks-main`

## Objetivos

1. Hacer que el workflow de seguridad falle **solo** si hay vulnerabilidades en `dependencies` de producción.
2. Tratar las vulnerabilidades de `devDependencies` como **warning**, aceptando riesgos documentados.
3. Eliminar `npm audit` del pipeline (migración completa a pnpm).
4. Añadir un check de **lint** en CI como job dentro de `node.js.yml` (Opción B).
5. Alinear los SHAs de `codeql-action/init` y `codeql-action/analyze`.
6. Reducir duplicidad entre `node.js.yml` y `tests.yml`.

## Cambios por archivo

### `.github/workflows/codeql.yml`
- Alinear `github/codeql-action/init` al SHA `c4dd10e44af883a891fe31ced449bcb4a6728b9b` (mismo que `analyze`).

### `.github/workflows/security.yml`
- Eliminar el paso `npm audit`.
- `pnpm audit --prod --json`: **gate duro**. Falla si hay vulns de producción.
- `pnpm audit --json`: **warning** con conteo de dev-vulns, ignorando paquetes aceptados (`image-size`).
- Crear issue/comentar en PR solo si hay vulns de producción.
- Mantener OSV Scanner y Snyk como info complementaria (`continue-on-error: true`).
- Referenciar `SECURITY_AUDIT_ANALYSIS.md` en el mensaje de warning.

### `.github/workflows/node.js.yml`
- Dividir en dos jobs paralelos:
  - `lint`: checkout → setup → install → `pnpm run lint`.
  - `build`: checkout → setup → install → build → SonarQube.
- Eliminar de `build`: tests, audit y component tests (duplicados con `tests.yml` y `security.yml`).

### `.github/workflows/tests.yml`
- Dejar `component-tests` pendiente, sin cambios funcionales.
- En `e2e-tests`, usar `pnpm install --frozen-lockfile` sin fallback permisivo.
- Ajustar `coverage-report.needs` para soportar estado volátil de component tests.

### `SECURITY_AUDIT_ANALYSIS.md`
- Añadir lista explícita de paquetes aceptados (`image-size`) para que el workflow la referencie.

## Verificación post-cambio

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run test-headless
pnpm run build
pnpm audit --prod
```

## Checks resultantes esperados

| # | Check | Origen |
|---|-------|--------|
| 1 | `lint` | `node.js.yml` |
| 2 | `build` | `node.js.yml` |
| 3 | `Unit Tests (Karma/Jasmine)` | `tests.yml` |
| 4 | `Component Tests (Cypress)` | `tests.yml` |
| 5 | `E2E Tests (Cypress)` | `tests.yml` |
| 6 | `Coverage Report` | `tests.yml` |
| 7 | `Test Summary` | `tests.yml` |
| 8 | `Security Vulnerability Scan` | `security.yml` |
| 9 | `Analyze (javascript-typescript)` | `codeql.yml` |
| 10 | `CodeQL` | GitHub |
| 11 | `Codacy` | Codacy |
| 12 | `SonarCloud` | SonarCloud |
| 13 | `SonarCloud Code Analysis` | SonarCloud |
| 14 | `security/snyk` | Snyk |

## Decisiones de diseño

- **Lint en `node.js.yml` (Opción B)**: evita un workflow adicional y reutiliza el setup de node/pnpm/cache; corre en paralelo a `build`.
- **Component tests pendientes**: no se tocan hasta que Cypress component testing sea compatible con Angular 21.
- **Riesgos dev-only aceptados**: `image-size` (sin parche upstream, transitivo de `less` en build toolchain).

## Registro de ejecución

- **2026-08-15**: Implementación en rama `ci/improve-checks-main`. PR #215 (docs) se cerró sin merge; el plan y la regla se re-crean en esta rama para dejar constancia.
