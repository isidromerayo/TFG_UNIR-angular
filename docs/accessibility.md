# Accesibilidad con pa11y — guía de uso y mantenimiento

Auditoría automática de accesibilidad de este frontend contra **WCAG 2.2 AA** con
[pa11y](https://github.com/pa11y/pa11y) + [pa11y-ci](https://github.com/pa11y/pa11y-ci) y
informes HTML con [pa11y-ci-reporter-html](https://gitlab.com/gitlab-ci-utils/pa11y-ci-reporter-html).
Traducción/ampliación de la sección «a11y» del README; el registro original del trabajo:
`docs/plans/2026-09-13-pa11y-accessibility.md`.

## Cadena de dependencias auditada

Versión trunkal (unificada con react y vue3 el 2026-10-31):

```
pa11y-ci 5.0.0 ──> pa11y 10.0.0 ──> puppeteer 25.x   (engines: ^22.13.0 || >=24)
        │
        └── reporters custom:
pa11y-ci-reporter-html 9.0.0 ──> pa11y-reporter-html-plus 6 ──> handlebars 4.7.10
   (engines: ^22.13.0 || ^24.11.0 || >=26; requiere pa11y-ci ^5.0.0 vía su propiedad `supports`)
```

- `pa11y` también está como devDependency directa para ejecuciones puntuales (`pnpm exec pa11y <url>`).
- Con `pa11y-ci@5` el paquete `extract-zip` **no existe en el árbol** (puppeteer 25 usa
  `@puppeteer/browsers` 3.x) — nada que silenciar en el audit por esa vía.
- puppeteer no puede descargar su navegador aquí (`pnpm.onlyBuiltDependencies` lo bloquea):
  todo el toolchain usa `/usr/bin/google-chrome-stable`.

## Cómo ejecutar

```bash
pnpm start              # servir la app en :4200
pnpm run a11y           # pa11y-ci sobre las URLs de .pa11yci
# (para datos reales de /home, /categorias, /categoria/:id, /curso/:id: backend Spring Boot en :8080;
#  localmente: ../TFG_UNIR-backend/scripts/podman-pod.sh start)
```

Salida: `reports/a11y/` (gitignored) con `index.html` (resumen), un HTML por URL y
`report.json` (`{ total, passes, errors, results: { "<url>": [issues] } }`).

Código de salida de `pa11y-ci`: `0` sin errores WCAG, `≠0` con errores o URLs fallidas.
**Es informativo**: no existe gate de a11y en el pipeline de merge (ver `a11y.yml` más abajo).

### Ejecución puntual de una URL

```bash
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable pnpm exec pa11y http://localhost:4200/home
```

La CLI de pa11y **no** lee `.pa11yci` (ni `chromeLaunchConfig`): hay que pasar lo que necesite por
flags/env.

## Configuración (`.pa11yci` en la raíz)

| Opción | Valor aquí | Notas |
|---|---|---|
| `standard` | `WCAG2AA` | WCAG 2.2 AA |
| `runners` | `["htmlcs", "axe"]` | `axe` es el que detecta contraste de color |
| `levelCapWhenNeedsReview` | `warning` | issues "needs review" no suben de warning |
| `timeout` / `wait` | `60000` / `2000` ms | `wait` cubre el render de datos del backend |
| `chromeLaunchConfig.executablePath` | `/usr/bin/google-chrome-stable` | puppeteer no descarga navegador |
| `reporters` | `cli`, `json`, `pa11y-ci-reporter-html` | ver matiz de reporter abajo |

**Matiz importante sobre el reporter**: el reporter HTML es `pa11y-ci-reporter-html`. El paquete
`pa11y-reporter-html` (suena igual) es un reporter de **pa11y**, no de **pa11y-ci**, y no funciona
dentro de la opción `reporters` de pa11y-ci (pa11y-ci descarta los valores de retorno de pa11y).

**El campo `supports` del reporter** (`^5.0.0` en v9; `^3.0.0 || ^4.0.0` en v8) es indicativo:
`pa11y-ci` **no lo valida** al cargar reporters. Una combinación incompatible puede funcionar o
fallar en runtime — lo único que demuestra compatibilidad es ejecutar `pnpm run a11y`.
Histórico: `pa11y-ci@5 + reporter 8.1.1` funcionaba en este repo (la v8 soportaba solo ci 3-4, y
aun así operaba); desde 2026-10-31 el repo está en el combo soportado 5+9.

## Job de CI: `a11y.yml` (PoC)

- Trigger: semanal (lunes 03:00 UTC) + `workflow_dispatch`. **No** corre en PRs.
- Levanta la imagen `isidromerayo/postgres-tfg` (base de datos **vacía**; el backend
  `isidromerayo/spring-backend-tfg` crea el schema con `ddl-auto=update`) con
  `--network host`; después `pnpm start` y `pnpm run a11y`.
- **Estado PoC**: hasta que publiquemos una imagen de BD con los datos semilla
  (origen: `recursos/db/postgresql/0*.sql` del workspace), en CI las rutas dinámicas se
  auditan en estado "sin datos". El audit **completo con datos reales** es el local:
  `../TFG_UNIR-backend/scripts/podman-pod.sh start` + `pnpm start` + `pnpm run a11y`.
  Cuando la imagen de BD con datos exista, el job se actualiza a usarla y deja de ser PoC.
- Los errores WCAG **no** ponen el job rojo (paso con `continue-on-error`); se listan en el Step
  Summary y el detalle va al artifact `a11y-reports` (14 días). El job solo falla si la infra no
  levanta o si `report.json` no se genera (= toolchain roto).
- Tras fusionar cambios en `a11y.yml`, lanzar un `workflow_dispatch` manual para validar la primera
  corrida real.

## Política de upgrade del árbol pa11y

1. Subir **`pa11y-ci` y `pa11y-ci-reporter-html` juntos** en la misma rama (o en orden
   `pa11y-ci` → reporter, nunca al revés): el reporter 9 requiere `pa11y-ci` 5.
2. Usar `pnpm up 'pa11y-ci@^X' 'pa11y-ci-reporter-html@^Y'` (nunca editar `package.json` a mano) y
   revisar el diff de `pnpm-lock.yaml`; los `pnpm.overrides`/`onlyBuiltDependencies` de seguridad
   en `package.json` no deben verse afectados.
3. **Verificar ejecutando `pnpm run a11y` contra dev server + backend** antes de fusionar: el verde
   de CI no prueba nada de pa11y.
4. Comprobar engines de Node contra `setup-node` en los workflows (aquí `node-version: 22.22.3`;
   ≥ 22.13 obligatorio).
5. Revisar el grafo post-bump: `pnpm audit --prod` (gate) + `pnpm security` +
   `docs/security/accepted-advisories.md` si alguna ruta de advisory pasa por el árbol de pa11y.
6. Si un bump de Dependabot toca `pa11y-ci` o `pa11y-ci-reporter-html`, cerrar su PR y aplicar el
   bump manualmente en rama propia (regla de este repo).

## Historial

- 2026-09-13 / 2026-10-17: setup inicial de la auditoría (PRs #254/#280) con `pa11y-ci@4` + `reporter@8`.
- 2026-10-15: `pa11y-ci@5` + `pa11y@10` entraron vía la PR de seguridad #276 (reporter se quedó en 8.1.1,
  combinación que funcionaba pese a `supports: ^3||^4`).
- 2026-10-31: `pa11y-ci-reporter-html@9` (combo soportado 5+9), job CI `a11y.yml` y esta guía.
  Registro de ejecución: `docs/plans/2026-10-31-pa11y-unificacion-y-docs.md`.
