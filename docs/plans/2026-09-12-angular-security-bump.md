# Plan: Actualización de seguridad Angular 21.2.23 y limpieza de PRs Dependabot

**Fecha**: 2026-09-12
**Herramienta**: opencode (opencode-go/deepseek-v4.1-flash)
**Estado**: done
**Rama de implementación**: `security/angular-21.2.23`
**PR**: https://github.com/isidromerayo/TFG_UNIR-angular/pull/249

## Objetivos

1. Corregir las 3 vulnerabilidades moderate de producción de Angular (`GHSA-hh8m-fm6v-7cvg` y `GHSA-p297-fm68-3q8c`) que bloquean el gate `pnpm audit --prod`.
2. Pasar el gate duro del workflow `Security Audit` y dejar el CI en verde.
3. Cerrar los PRs Dependabot #246, #247 y #248 (lockfile incompatible con `pnpm.overrides`).

## Diagnóstico

Los 3 PRs de Dependabot fallaban en `pnpm install --frozen-lockfile` con:

```
ERR_PNPM_LOCKFILE_CONFIG_MISMATCH
The current "overrides" configuration doesn't match the value found in the lockfile
```

Dependabot regenera `pnpm-lock.yaml` **eliminando el bloque `overrides:`** mientras `package.json` mantiene `pnpm.overrides`. Además, cada PR sube un único paquete Angular sin alinear versiones.

## Cambios por archivo

### `package.json` + `pnpm-lock.yaml`
- Bump de producción `@angular/{animations,common,compiler,core,forms,platform-browser,platform-browser-dynamic,router}` a `^21.2.23`.
- Bump de `@angular/compiler-cli` a `^21.2.23`; `@angular/cli` y `@angular-devkit/build-angular` a `^21.2.24`.
- Override `@babel/core`: `>=7.29.6` → `>=7.29.6 <8`.
- Nueva devDependency `@babel/core@7.29.7` (evita que `auto-install-peers` resuelva 8.x, incompatible con Karma/Cypress).
- Se conserva el bloque `pnpm.overrides` completo.

### `SECURITY_AUDIT_ANALYSIS.md`
- Nueva sección con las 3 CVE corregidas, el bump aplicado y el ajuste de `@babel/core`.

## Verificación

- `pnpm install --frozen-lockfile` → OK (sin `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`).
- `pnpm audit --prod` → 0 vulnerabilidades.
- `pnpm run lint` → OK.
- `pnpm run test-headless` → 181 SUCCESS.
- `pnpm run build` → OK.
- `pnpm audit` (completo) → 0 vulnerabilidades (`less@4.9.0` ya no arrastra `image-size`).

## Decisiones

- No mergear los PRs de Dependabot npm (patrón ya documentado en `docs/plans/2026-09-08-dependabot-security-and-pr-cleanup.md`): su lockfile es incompatible con `pnpm.overrides`.
- Un único PR con todo `@angular/*` alineado en lugar de 3 PRs parciales.
- Fijar `@babel/core` en 7.29.7 + override `<8` para mantener estable la toolchain de tests.

## Estado actual

Implementación y verificación completadas. PR #249 abierto con todos los checks en verde; #246/#247/#248 cerrados como superseded.
