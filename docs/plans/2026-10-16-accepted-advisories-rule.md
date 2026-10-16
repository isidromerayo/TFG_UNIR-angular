# Plan: advisories aceptados + revisión automática de parche

- **Fecha**: 2026-10-16
- **Herramienta/modelo**: opencode (deepseek-v4.1-flash)
- **Estado**: done (rama `chore/accepted-advisories-rule`, PR abierta)

## Objetivos

1. Fijar la regla: un advisory **sólo** se acepta si no hay versión parcheada publicada.
2. Registrar de forma única qué advisories están aceptados, con motivo, alcance y ruta.
3. Revisarlo en cada iteración de forma automática: fallar en cuanto exista solución.

## Contexto

La aceptación vivía en la lista `ACCEPTED` de `.github/workflows/security.yml` (aviso dev-only) y en
un bullet de `AGENTS.md`. Nada avisaba cuando el upstream publicaba un parche, así que el silencio
podía quedarse "para siempre". Hoy el único advisory aceptado es `braces@3.0.3`
(`GHSA-vfj7-8cjw-p6xm`, sin parche: todas las versiones publicadas están afectadas), que entra por
`@angular-devkit/build-angular > http-proxy-middleware > micromatch > braces` (build/lint, dev).

## Cambios

- `docs/security/accepted-advisories.md`: registro (bloque `json accepted-advisories`) + regla +
  checklist de aceptación y de revisión.
- `scripts/check-accepted-advisories.sh`: consulta OSV (`/v1/vulns/{id}` y `/v1/query`) por cada
  entrada y falla si hay un evento `fixed` publicado para nuestro paquete/ecosistema, o si el
  advisory ya no aplica a la versión registrada (registro obsoleto).
- `package.json`: script `security:accepted`.
- `.github/workflows/security.yml`: paso *Accepted advisories recheck (unpatched only)*.
- `AGENTS.md`: regla junto al bullet de CI.

## Decisiones de diseño

- **Chequeo contra OSV** (no contra `pnpm audit`): expone `fixed` por paquete/ecosistema y es la
  fuente que ya usa el `osv-scanner` del workflow.
- **Sólo cuentan los `fixed` de nuestro paquete/ecosistema** (evita falsos positivos de fixes sin
  release publicado).
- Si OSV no responde (sin red), el script avisa y sale 0 para no bloquear PRs por una caída externa.
- No se toca el gate de producción ni la lista `ACCEPTED` (sigue igual en los tres frontends).

## Verificación

- `./scripts/check-accepted-advisories.sh` → ✅ `braces@3.0.3` sigue sin parche.
- Caso negativo: registry de prueba con `lodash@4.17.10` (`GHSA-jf85-cpcp-j695`) → ❌ *YA HAY PARCHE
  publicado → 4.17.12* y exit code 1.
- `pnpm run test-headless` + `pnpm run build` en la rama.
