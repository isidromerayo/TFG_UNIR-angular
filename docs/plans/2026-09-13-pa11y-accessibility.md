# Plan: Añadir pa11y para auditoría de accesibilidad (WCAG 2.2 AA)

**Fecha**: 2026-09-13
**Herramienta**: opencode (opencode-go/qwen3.8-flash)
**Estado**: done
**Rama de implementación**: `feature/pa11y-accessibility`

## Objetivos

1. Integrar `pa11y`/`pa11y-ci` como auditor automático de accesibilidad del frontend Angular.
2. Ejecutable localmente contra el dev server (`:4200`) sobre todas las rutas públicas.
3. Carácter **advisory**: no bloquea nada (decisión del usuario; el job de CI propuesto se descartó a petición propia).

## Cambios por archivo

### `package.json` + `pnpm-lock.yaml`
- Nuevas devDependencies: `pa11y@10.0.0`, `pa11y-ci@4.1.1` (vía `pnpm add -D`, pnpm 10).
- Nuevos scripts:
  - `a11y`: `pa11y-ci` (usa `.pa11yci` del repo).
  - `a11y:report`: `pa11y-ci --json > pa11y/report.json`.

### `.pa11yci` (nuevo, raíz)
- `standard: WCAG2AA`, `timeout: 60000`, `wait: 2000`.
- `chromeLaunchConfig.executablePath: /usr/bin/google-chrome-stable` (+ `--no-sandbox`, `--disable-dev-shm-usage`).
- 7 URLs: `/home`, `/categorias`, `/categoria/2`, `/carrito`, `/acceso`, `/registro`, `/no-existe-404`.

### `.gitignore`
- `/pa11y` (salida de `a11y:report`).

### Documentación
- `AGENTS.md`: comandos `a11y`/`a11y:report` y gotcha de Chrome del sistema.
- `README.md`: nueva sección "♿ Accessibility audits (pa11y)".

## Verificación

- `pnpm run a11y` (con `pnpm start` y backend `:8080` arriba) → **7/7 URLs, 0 errores WCAG2AA**.
- Sondeo profundo `WCAG2AAA` en `/acceso` detecta 5 errores reales (p. ej. `<i title=...>` sin nombre accesible) → confirma que pa11y inspecciona el DOM renderizado de la SPA (no falso negativo).
- `pnpm run build` → OK.

## Decisiones

- **Sin job en CI** (petición explícita durante la revisión del plan); el hallazgo de 0 errores AA puede reabrir la idea más adelante.
- **Chrome del sistema** en vez de descargar el de puppeteer: su postinstall está bloqueado por `pnpm.onlyBuiltDependencies`; añadir puppeteer a la lista habría exigido tocar la política de builds.
- Rutas con parámetros incluidas (`/categoria/2`) porque el backend local estaba disponible; `/mis-datos` y `/mis-cursos` excluidas (requieren sesión JWT).
- Estándar AA (no AAA): es el objetivo de conformidad del TFG y coincide con el `wcag` skill del repo.

## Estado actual

Implementado y verificado en local. Pendiente de commit/PR por el autor.
