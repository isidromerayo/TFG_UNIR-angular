# Plan: Añadir pa11y para auditoría de accesibilidad (a11y, WCAG 2.2 AA)

**Fecha**: 2026-09-13
**Herramienta**: opencode (opencode-go/qwen3.8-flash)
**Estado**: done
**Rama de implementación**: `feature/pa11y-accessibility`

## Objetivos

1. Integrar `pa11y`/`pa11y-ci` como auditor automático de accesibilidad del frontend Angular.
2. Ejecutable localmente contra el dev server (`:4200`) sobre todas las rutas públicas.
3. Informe HTML por URL + JSON en `reports/a11y/`.
4. Carácter **advisory**: no bloquea nada (decisión del usuario; el job de CI propuesto se descartó a petición propia).

## Cambios por archivo

### `package.json` + `pnpm-lock.yaml`
- Nuevas devDependencies: `pa11y@10.0.0`, `pa11y-ci@4.1.1`, `pa11y-ci-reporter-html@8.1.1` (vía `pnpm add -D`, pnpm 10).
- Nuevo script: `a11y` → `pa11y-ci` (usa `.pa11yci` del repo; emite cli + json + html en cada ejecución).

### `.pa11yci` (nuevo, raíz)
- `standard: WCAG2AA`, `runners: ["htmlcs", "axe"]`, `timeout: 60000`, `wait: 2000`.
- `chromeLaunchConfig.executablePath: /usr/bin/google-chrome-stable` (+ `--no-sandbox`, `--disable-dev-shm-usage`).
- 8 URLs: `/home`, `/categorias`, `/categoria/2`, `/curso/12`, `/carrito`, `/acceso`, `/registro`, `/no-existe-404`.

### `pa11y-ci-reporter-html` (v8.1.1) como devDependency única
- Reporter oficial compatible con pa11y-ci: escribe `index.html` resumen + un HTML por página + JSON.
- Configurado en `.pa11yci` como `["pa11y-ci-reporter-html", { destination, includeZeroIssues }]`.
- **Ojo con los nombres**: `pa11y-reporter-html` (el del README de pa11y-ci) es un reporter de pa11y que devuelve un string; pa11y-ci descarta el retorno (cycleReporters en lib/pa11y-ci.js) → no genera nada. Probado empíricamente con pa11y-ci 3 y 4: 0 bytes.

### `.gitignore`
- `/reports` (salida de los informes pa11y).

### Documentación
- `AGENTS.md`: comandos `a11y`, ubicación de informes y nota reporter correcto vs homónimo.
- `README.md`: nueva sección "a11y: Accessibility audits (pa11y)".

## Verificación

- `pnpm run a11y` (con `pnpm start` y backend `:8080` arriba) → **8/8 URLs, 0 errores** con runners duales htmlcs+axe.
- Primer passe con axe: contrast failures en los links del navbar (rgba(255,255,255,.6) sobre #b52e31 = 3.14:1; SC 1.4.3), 10 `link-in-text-block` en /categorias (SC 1.4.1) y el hero de /home → corregidos.
- `/registro`: 4 *orphaned form labels* (htmlcs `H44.NonExistentFragment`: `for` sin `id` en el input) → corregidos con `id` y eliminando `aria-label` redundante (causaba además 2.5.3 label-in-name).
- `pnpm run test-headless` → 181 SUCCESS. `pnpm run lint` → 0 errores. `pnpm run build` → OK.
- Muestreo de píxeles del hero: ratio real ≈ 12:1 (el fallo era *needs review*, no violating).

## Decisiones

- **Sin job en CI** (petición explícita durante la revisión del plan).
- **Chrome del sistema** en vez de descargar el de puppeteer: postinstall bloqueado por `onlyBuiltDependencies`.
- Rutas con parámetros incluidas (`/categoria/2`) porque el backend local estaba disponible; `/mis-datos` y `/mis-cursos` excluidas (requieren sesión JWT).
- Estándar AA (no AAA): objetivo de conformidad del TFG; coincide con skill `wcag` del repo.
- Runners duales: htmlcs (WCAG2AA clásico) + axe (contraste y WCAG 2.x moderno).
- **`levelCapWhenNeedsReview: "warning"`**: axe no puede calcular contraste sobre gradientes ni pseudo-elementos overlay (`messageKey: bgGradient/pseudoContent`); el overlay del hero es legitimo (12:1 medido) y WAVE/axe DevTools lo tratan como "needs review", no error. Se cap a warning para no false-positivear.
- Overlay del hero como `::before` con `rgba` plano (equivalente visual al gradiente, más simple de mantener).
- Redundant link de WAVE (logo + "Home", ambos → /home): no viola ningún SC (cada link tiene nombre descriptivo propio, SC 2.4.4 OK); WAVE lo marca solo como alerta. Se deja intencionadamente.

## Estado actual

Implementado y verificado (8/8 con htmlcs+axe). Commits en `feature/pa11y-accessibility`: `11e7e5d` (setup), `302d0cc` (runners+informes), `b4bec60` (contraste menú/hero/categorias), `42fbf97` (registro + needs-review), `c40799a` (reporter oficial sin wrapper), `084bc10` (auditoría /curso/12).

