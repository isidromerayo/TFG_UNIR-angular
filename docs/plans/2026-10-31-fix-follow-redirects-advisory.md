# Plan: corregir advisory de follow-redirects (CVE-2026-116689)

- **Fecha**: 2026-10-31
- **Herramienta/modelo**: opencode (deepseek-v4.1-flash)
- **Estado**: done (rama `fix/security-follow-redirects`, PR abierta)

## Objetivos

1. Desbloquear el gate duro `pnpm audit (production gate)` de `security.yml`, en rojo desde la
   ejecución programada del 2026-10-31.
2. Corregir —no silenciar— el advisory: existe versión parcheada publicada.

## Contexto

La ejecución programada [41183189518](https://github.com/isidromerayo/TFG_UNIR-angular/actions/runs/41183189518)
falló con `Found 1 production vulnerabilities`. El advisory `GHSA-mrwp-f3q8-3g9p`
(`CVE-2026-116689`, high, CVSS 5.9) se publicó el 2026-10-30 a las 22:59 UTC, después de la última
ejecución verde, así que no hay ningún cambio de código detrás.

Ruta: `.>axios>follow-redirects`, versión resuelta **1.16.1** (vulnerable `>=1.16.0 <=1.16.1`). El
override `"follow-redirects": ">=1.16.1"` permitía justo la versión vulnerable.

Alcance real bajo: el propio advisory indica que axios 1.20.0 normaliza `sensitiveHeaders` y no
reproduce la fuga; aun así la dependencia entra en el bundle de producción vía `axios`.

## Cambios

- `package.json`: override `follow-redirects` de `>=1.16.1` a `>=1.16.2`.
- `pnpm-lock.yaml`: `follow-redirects` 1.16.1 → 1.16.2 (resolución, no cambio de rango declarado
  por `axios`, que acepta `^1.15.6`).

## Decisiones de diseño

- Se sube el override en lugar de añadir una excepción: la regla del proyecto es que un advisory
  **con** parche se corrige con `pnpm.overrides`, nunca se acepta ni se ignora por CVE.
- `1.16.2` es un patch de la propia librería; no hay cambio de major ni de API.

## Verificación

- `pnpm install` → lockfile con `follow-redirects@1.16.2`.
- `pnpm audit --prod` → `No known vulnerabilities found`.
- `pnpm run test-headless` → `TOTAL: 181 SUCCESS`.
- `pnpm run build` → bundle generado correctamente.
- Pendiente: `workflow_dispatch` de `Security Audit` tras el merge.
