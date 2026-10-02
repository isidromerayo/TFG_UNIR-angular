# Plan: Vulnerabilidades del toolchain dev + consolidación CodeQL 4.38.2 (Vía A)

**Fecha**: 2026-10-02
**Herramienta**: opencode (opencode-go/deepseek-v4.1-flash)
**Estado**: done
**Rama de implementación**: `security/devtool-vulns-codeql-4.38.2`
**PR**: https://github.com/isidromerayo/TFG_UNIR-angular/pull/269

## Objetivos

1. Reducir las vulnerabilidades dev reportadas por `pnpm audit` (15 → 2) sin subir a Angular 22.
2. Sustituir las PR dependabot #265/#266 (que fallan por desajuste de versión CodeQL) por un único
   cambio que actualice `init` y `analyze` a 4.38.2.
3. Alinear la documentación y la lista de aceptados del CI con el estado real.

## Contexto / Decisión

`pnpm audit --prod` siempre dio **0**; el gate duro de CI no estaba en riesgo. Los 15 avisos eran
transitivos de dev. Se descarta Angular 22.2.1 (major: exige TypeScript >=6.0 y Node ^22.22.3):
no existe ningún minor nuevo en la rama 21.x (techo `21.2.25`/`21.2.24`). Se opta por la **Vía A**:
forzar versiones parcheadas vía `pnpm.overrides`, aceptando `extract-zip` (sin parche upstream).

## Cambios por archivo

### `package.json` + `pnpm-lock.yaml`
Bumps de `pnpm.overrides` a las versiones parcheadas: `piscina >=5.3.2` (nuevo),
`webpack-dev-middleware >=8.3.0` (nuevo), `basic-ftp >=6.2.1` (nuevo), `brace-expansion >=5.0.12`,
`engine.io >=6.6.10`, `js-yaml >=5.4.1`, `fast-uri >=4.1.5`, `ip-address >=10.7.1`,
`serialize-javascript >=7.1.2`. Resultado: 15 → 2 avisos (ambos `extract-zip`, aceptados).

### `.github/workflows/codeql.yml`
`github/codeql-action/init` y `github/codeql-action/analyze` de `1c5b6756…` (4.38.1) →
`2892aa5e…` (4.38.2), ambos en el mismo commit para evitar el desajuste de versión.

### `.github/workflows/security.yml`
Lista de aceptados `image-size` → `extract-zip`; el output/warning usa las vulnerabilidades dev
**no aceptadas** (antes emitía warning aunque todas estuvieran aceptadas).

### Documentación
`AGENTS.md` y `SECURITY_AUDIT_ANALYSIS.md`: nueva sección 2026-10-02 con el detalle de overrides,
riesgo aceptado `extract-zip` y la consolidación CodeQL.

## Verificación

- `pnpm audit --prod` → 0 vulnerabilidades.
- `pnpm audit` → 2 (solo `extract-zip`, aceptado).
- `pnpm run test-headless`, `pnpm run build`, `pnpm run lint`.
- CI: workflow `CodeQL Advanced` en verde (init/analyze alineados).

## Decisiones

- No subir a Angular 22 (Vía B) por su coste (TS 6, Node mínimo, breaking changes) y porque no
  cubre las vulns de karma/cypress/pa11y.
- No parchear `webpack-dev-middleware` antes: se difirió por ser major (7→8); al comprobarse que
  la copia vulnerable es 8.1.1 (rango >=8.0.0 <8.3.0) el salto dentro de 8.x es seguro.

## Estado actual

Completado y verificado localmente (`pnpm audit --prod` 0; `pnpm audit` 2 aceptados; 181 tests,
branches 100%; build y lint OK). PR #269 abierto; PRs #265/#266 cerradas por quedar supersedidas.
