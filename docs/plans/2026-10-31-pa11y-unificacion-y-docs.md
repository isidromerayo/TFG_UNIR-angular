# Unificación del stack pa11y: reporter-html 9 + docs + job a11y.yml

- **Fecha**: 2026-10-31
- **Herramienta/modelo**: OpenCode · Qwen3.8 Flash
- **Estado**: done (2026-10-31)

## Contexto

React y vue3 cerraron hoy PRs unificadas del árbol pa11y (react #272, vue3 #279):
`pa11y@10 / pa11y-ci@5 / pa11y-ci-reporter-html@9`. Este repo ya tenía `pa11y-ci@5`
desde la PR de seguridad #276 (2026-10-15) con `pa11y@10`, pero el reporter seguía
en 8.1.1 — combo funcional pese a que el `supports` de la v8 solo declara ci 3-4
(los informes de 2026-10-31 lo demostraron). Dependabot nunca abrió el bump del
reporter aquí. Decisión de equipo: documentar el uso de pa11y y añadir el job CI
informativo `a11y.yml` en la misma PR.

## Objetivos

1. `pa11y-ci-reporter-html@9.0.0` lockado (combo soportado 5+9) y verificado con `pnpm run a11y` real.
2. Documentación: sección a11y del README actualizada, `docs/accessibility.md` como referencia completa, AGENTS.md con stack/policy, DOCS_INDEX enlazado.
3. Job `a11y.yml`: semanal + dispatch, backend + imagen de BD del proyecto (PoC, BD sin datos), artifact, sin gate de merge.

## Cambios

| Archivo | Cambio |
|---|---|
| `package.json` + `pnpm-lock.yaml` | `pnpm up 'pa11y-ci-reporter-html@^9.0.0'` |
| `.github/workflows/a11y.yml` | Nuevo (schedule lun 03:00 UTC + dispatch; imagen `isidromerayo/postgres-tfg:1.1` —BD vacía, PoC— + backend `isidromerayo/spring-backend-tfg:0.7.1`; Node 22.22.3; actions pinneadas por SHA de 40 chars; `continue-on-error` en el audit; resumen `jq`; artifact 14 días) |
| `README.md` | Sección a11y: stack unificado, job `a11y.yml`, enlace a la guía |
| `AGENTS.md` | Bloque a11y: stack + caveat `supports` (pa11y-ci no lo valida) + política de upgrade; gotcha CI añade `a11y.yml` |
| `docs/accessibility.md` | Nueva referencia completa |
| `DOCS_INDEX.md` | Bloque "¿Cómo auditar accesibilidad?" enlaza guía + plan + workflow |

## Decisiones de diseño

- `node-version: '22.22.3'` en `a11y.yml` (igual que el resto de workflows del repo) para respetar
  engines de ci 5 / reporter 9 (≥ 22.13).
- Seed **no** vendorizado (revisado el mismo día): el job arranca la imagen `postgres-tfg` con
  BD vacía — **PoC** pensada para cuando publiquemos una imagen de backend/BD que se pueble en su
  propia creación; entonces pasa a auditar con datos reales sin más cambios. El audit completo con
  datos se verificó localmente en esta PR (podman-pod + `recursos/db`, 8/8). Se evitan la
  duplicación de `recursos/db` y la fricción con el linter SQL de Codacy (sin `.codacy.yml`).
- `a11y.yml` informativo: rojo solo por infra/toolchain roto, nunca por hallazgos WCAG (coherente
  con el exit code advisory documentado).

## Verificación realizada

- `pnpm install --frozen-lockfile` ✅.
- `pnpm run a11y` real (ci 5 + reporter 9) contra dev server :4200 + backend :8080 con seed
  (podman pod del backend): **8/8 URLs, 0 errores** ✅ (informes regenerados con reporter 9).
- `pnpm run lint` ✅ (0 errores, 1 warning preexistente).
- `pnpm run test-headless` ✅ 181/181; `pnpm run test-headless-cc` ✅ 181/181 (sin cambios en src,
  coverage intacto).
- `pnpm run build` ✅; `pnpm audit --prod` → 0 vulnerabilidades ✅ (y full audit sin extract-zip ya
  documentado en AGENTS).
- `a11y.yml` YAML válido; `jq` del resumen probado contra el `report.json` real (misma estructura
  que react/vue3).

## Pendiente al cerrar

- [x] Primera corrida workflow_dispatch (31-oct 14:08 UTC): 8/8 URLs, 0 errores — run 41208738284. Nota PoC: BD del job sin datos (opción B).
- [x] Monorepo: PR #27 mergeada (de3b19f), angular/ apuntando a main con este cambio.
- Nota para react/vue3: la subida del reporter a 9 les quitó el `handlebars` CVE-covered por
      su propio bump (react mantiene su override global, inofensivo).
