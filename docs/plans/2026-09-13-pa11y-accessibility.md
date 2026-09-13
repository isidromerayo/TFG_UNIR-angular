# Plan: Añadir pa11y para auditoría de accesibilidad (a11y, WCAG 2.2 AA)

**Fecha**: 2026-09-13
**Herramienta**: opencode (opencode-go/qwen3.8-flash)
**Estado**: in progress
**Rama de implementación**: `feature/pa11y-accessibility`

## Objetivos

1. Integrar `pa11y`/`pa11y-ci` como auditor automático de accesibilidad del frontend Angular.
2. Ejecutable localmente contra el dev server (`:4200`) sobre todas las rutas públicas.
3. Informe HTML por URL + JSON en `reports/a11y/`.
4. Carácter **advisory**: no bloquea nada (decisión del usuario; el job de CI propuesto se descartó a petición propia).

## Cambios por archivo

### `package.json` + `pnpm-lock.yaml`
- Nuevas devDependencies: `pa11y@10.0.0`, `pa11y-ci@4.1.1` (vía `pnpm add -D`, pnpm 10).
- Nuevos scripts:
  - `a11y`: `pa11y-ci` (usa `.pa11yci` del repo).
  - `a11y:html`: solo el reporter HTML local.

### `.pa11yci` (nuevo, raíz)
- `standard: WCAG2AA`, `runners: ["htmlcs", "axe"]`, `timeout: 60000`, `wait: 2000`.
- `chromeLaunchConfig.executablePath: /usr/bin/google-chrome-stable` (+ `--no-sandbox`, `--disable-dev-shm-usage`).
- 7 URLs: `/home`, `/categorias`, `/categoria/2`, `/carrito`, `/acceso`, `/registro`, `/no-existe-404`.

### `scripts/pa11y-html-reporter.js` (nuevo)
- Reporter local para pa11y-ci que usa `pa11y-reporter-html@2.0.0` y escribe un HTML por URL.
- **Nota**: el ejemplo del README de pa11y-ci sugiere poner `"pa11y-reporter-html"` directamente en `defaults.reporters`, pero pa11y-ci descarta el valor de retorno de los reporters → ese paquete no funciona sin wrapper.

### `.gitignore`
- `/reports` (salida de los informes pa11y).

### Documentación
- `AGENTS.md`: comandos `a11y`/`a11y:html`, ubicación de informes y nota sobre el wrapper del reporter HTML.
- `README.md`: nueva sección "a11y: Accessibility audits (pa11y)".

## Verificación

- `pnpm run a11y` (con `pnpm start` y backend `:8080` arriba) → **0/7 URLs en verde** al activar axe: detecta 5 contrast failures (4 navbar + hero h2/p) — mismos hallazgos que WAVE y axe DevTools.
- Con solo htmlcs (pa11y estándar) → 7/7 (HTML CodeSniffer no evalúa contraste; axe sí: SC 1.4.3).
- Sondeo AAA con WCAG2AAA sobre `/acceso` detectó 5 errores reales (`<i aria-hidden>` con texto, contraste) → confirma que no era falso negativo.
- `pnpm run build` → OK.

## Decisiones

- **Sin job en CI** (petición explícita durante la revisión del plan).
- **Chrome del sistema** en vez de descargar el de puppeteer: postinstall bloqueado por `onlyBuiltDependencies`.
- Rutas con parámetros incluidas (`/categoria/2`) porque el backend local estaba disponible; `/mis-datos` y `/mis-cursos` excluidas (requieren sesión JWT).
- Estándar AA (no AAA): objetivo de conformidad del TFG; coincide con skill `wcag` del repo.
- Runners duales: htmlcs (WCAG2AA clásico) + axe (contraste y WCAG 2.x moderno).
- Reportes HTML: wrapper local porque `pa11y-reporter-html` es incompatible con el contrato reporters de pa11y-ci.

## Estado actual

Implementado y verificado en local. Pendiente de commit/PR por el autor.

