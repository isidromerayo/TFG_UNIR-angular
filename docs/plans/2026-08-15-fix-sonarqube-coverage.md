# Plan: Fix SonarQube coverage dropped to 0%

**Fecha**: 2026-08-15
**Herramienta/modelo**: opencode (opencode/big-pickle)
**Estado**: done

## Objetivos
Restaurar la cobertura reportada por SonarCloud (~80%, gate Verde). Tras el merge de #216 la cobertura cayó a 0.0% porque el job `build` de `node.js.yml` dejó de generar los `lcov.info` que consume el scan de SonarQube.

## Causa raíz
- `node.js.yml` (job `build`): antes de #216 ejecutaba `test-headless-cc` (generaba `coverage/frontend-angular/lcov.info`) antes del `SonarQube Scan`. #216 eliminó ese paso, pero el scan siguió en `build`, ahora sin archivos de cobertura.
- `sonar-project.properties:16-17` espera `coverage/merged/lcov.info`, `coverage/frontend-angular/lcov.info`, `coverage/cypress/lcov.info`.
- Los lcov sí se generan en `tests.yml` (job `unit-tests` → artifact `karma-coverage`), pero ningún workflow puede consumirlos para SonarQube.

## Solución elegida (Opción C, aprobada por el usuario)
Mover el análisis de SonarQube a `tests.yml`, donde se produce la cobertura.

### Cambios de archivos
1. `.github/workflows/tests.yml` — nuevo job `sonarqube`:
   - `needs: [unit-tests]`
   - `if: github.ref == 'refs/heads/main' || (github.event_name == 'pull_request' && github.base_ref == 'main')` (mantener alcance solo `main`/PRs a `main`)
   - Checkout con `fetch-depth: 0` (relevancia del análisis de ramas)
   - Descarga del artifact `karma-coverage` (v3.1.0, mismo run) a `coverage/`
   - `SonarQube Scan` (`SonarSource/sonarqube-scan-action@22918119...`) con `SONAR_TOKEN` y `GITHUB_TOKEN`
2. `.github/workflows/node.js.yml` — limpiar job `build`:
   - Eliminar paso `SonarQube Scan` y `env: SONAR_TOKEN`
   - Eliminar `fetch-depth: 0` del checkout (solo servía a SonarQube)

### Sin cambios
- `sonar-project.properties`, `karma.conf.js`, job `coverage-report` (sigue comentando cobertura en PRs)

## Verificación
1. YAML válido (`python3 -m yaml`)
2. Merge de PR + confirmar vía API de SonarCloud que el análisis reporta cobertura ~80% y quality gate **Verde** (antes: 0.0%, Rojo)

## Decisiones de diseño
- Opción C vs A (re-ejecutar tests en `build`) vs B (cross-workflow artifacts): C no duplica tests, consume la cobertura donde se genera y deja `node.js.yml` como lint+build rápido.
- No se analiza `develop` (queda fuera por el `if:`), igual que el comportamiento actual.

## Registro de ejecución
- 2026-08-15: rama `fix/sonarqube-coverage` creada desde `main` (e8f24c8, incluye #217). Cambios aplicados y commit pendiente.
- 2026-08-15: PR #218 mergeada (`33e7794`). Cobertura SonarCloud restaurada: 0.0% → 97.2% en PR #218 (232 líneas a cubrir, 7 sin cubrir), quality gate Verde.
- 2026-08-15: 17 code smells detectados por SonarCloud corregidos en rama `fix/sonarqube-issues` (S5914 ×3, S6644, S7757, S7754, S5906 ×11). PR #219 mergeada. Codacy marcó falsos positivos `no-unsafe-call` sobre `toHaveSize` (resueltos con `eslint-disable-next-line` inline) y anotación trivial en `slider.component.ts` (eliminada). PR #220 de GHCopilot cerrada en favor de #219.
- 2026-08-15: plan completado.
