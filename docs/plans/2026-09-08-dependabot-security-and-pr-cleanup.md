# Plan: Dependabot cleanup, seguridad y CI

**Fecha**: 2026-09-08
**Herramienta**: opencode (opencode-go/grok-4.6)
**Estado**: done
**Rama de implementación**: `security/dependabot-cleanup`

## Objetivos

1. Cerrar alertas Dependabot abiertas de `browserslist`, `fast-uri` y `postcss-selector-parser`.
2. Actualizar deps seguras (patch/minor) con `pnpm up`, sin majors rotos.
3. Unificar CodeQL `init` + `analyze` en v4.37.9 y subir `pnpm/action-setup` a v6.0.10.
4. Limpiar `dependabot.yml` (plantilla Next/React, labels, ignores de majors).
5. Etiquetar PRs fallidas como `invalid` y cerrar las rotas/superseded.

## Cambios por archivo

### `package.json` + `pnpm-lock.yaml`
- Overrides: `browserslist >=4.28.7`, `fast-uri >=4.1.3`, `postcss-selector-parser >=7.1.3`.
- `pnpm up` de axios, zone.js, `@angular/cli`, `@typescript-eslint/*` y cypress (minor/patch).

### `.github/workflows/codeql.yml`
- `init` y `analyze` al SHA `cdf488f595d80d6e07e03d4674febd5ab45fa938` (v4.37.9).

### `.github/workflows/{node.js,security,tests}.yml`
- `pnpm/action-setup@0977fd99725f1db4007ccb2928dbb4e90d06cc86` (v6.0.10).

### `.github/dependabot.yml`
- Quitar grupos Next/React y `testing-tools`.
- Ignore majors: `eslint`, `jasmine-core`, `@cypress/*`.
- Mantener labels `github-actions` + `automated` (crear el label en GitHub).

## PRs GitHub

- `invalid` en PRs con CI rojo (faltaba #235).
- Cerrar #232, #234, #235, #237–#242 y #236 (superseded).

## Verificación

- `pnpm audit`
- `pnpm run lint`
- `pnpm run test-headless`
- `pnpm run build`

## Decisiones

- No mergear PRs de Dependabot npm: lockfile incompatible con `pnpm.overrides`.
- No subir eslint 10, jasmine-core 7 ni majors de `@cypress/*`.
- CodeQL no se puede bumpear `init` y `analyze` en PRs separadas.

## Estado actual

done

Verificación local: lint OK, 181 tests OK, build OK. `pnpm audit` queda en 2 high de `image-size` (sin parche, riesgo aceptado en CI de dev). Override extra de `qs >=6.16.0` aplicado durante la ejecución.
