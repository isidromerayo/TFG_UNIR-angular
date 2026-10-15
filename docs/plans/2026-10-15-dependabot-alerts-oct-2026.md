# Plan: Alertas de Dependabot + auditoría dev (octubre 2026)

**Fecha**: 2026-10-15
**Herramienta**: opencode (opencode-go/deepseek-v4.1-flash)
**Estado**: done
**Rama de implementación**: `security/dependabot-alerts-oct-2026`
**PR**: https://github.com/isidromerayo/TFG_UNIR-angular/pull/276

## Objetivos

1. Cerrar las 5 alertas abiertas de Dependabot: #242 (`shell-quote`, critical), #241
   (`http-cache-semantics`, high), #243 (`@modelcontextprotocol/sdk`, high) y #214/#228
   (`extract-zip`, high ×2).
2. Reducir los avisos de `pnpm audit` dev de **12 → 1**, corrigiendo también los que Dependabot no
   había abierto (`handlebars`, `source-map-js`, `proxy-addr`, `compression`).
3. Alinear CI y documentación con el estado real de la lista de riesgos aceptados.

## Contexto / Decisión

`pnpm audit --prod` siempre fue **0**; todas las alertas eran de dependencias **transitivas de dev**.
Datos que condicionan el plan:

- `extract-zip@2.0.1` no tiene parche, pero `pa11y-ci@5.0.0` ya lo elimina del árbol (usa
  `puppeteer 25` → `@puppeteer/browsers 3.x`, que extrae con `modern-tar`). Es la vía para cerrar
  #214/#228 de verdad en lugar de acumular riesgos aceptados.
- `@modelcontextprotocol/sdk` está pineado en **exacto** por `@angular/cli` (`1.30.0`); `21.2.27`
  ya pinea la `1.31.0` parcheada, así que se sube el CLI en lugar de forzar un `override`.
- `http-cache-semantics` aparece como `patched_versions: <0.0.0` en la npm Advisory DB, pero
  `4.3.0` (publicado el 2026-10-04) está limpio en OSV/GitHub: basta el override.
- `braces@3.0.3` es la última versión publicada y sigue vulnerable (`<0.0.0` de parche) → riesgo
  aceptado, sustituye a `extract-zip` en la lista del CI.

## Cambios por archivo

### `package.json` + `pnpm-lock.yaml`

- devDependencies: `@angular/cli` `^21.2.24` → `^21.2.27`, `@angular-devkit/build-angular`
  `^21.2.24` → `^21.2.27`, `pa11y-ci` `^4.1.1` → `^5.0.0`.
- `pnpm.overrides`: `shell-quote` `>=1.8.4` → `>=1.11.0`; nuevos `http-cache-semantics >=4.3.0`,
  `source-map-js >=1.2.2`, `proxy-addr >=2.0.8`, `compression >=1.8.2`, `handlebars >=4.7.10`.
- No se toca ningún pin de seguridad previo. Resultado del install: +36 / −88 paquetes
  (desaparecen `extract-zip`, `pa11y@9.1.1` y el `puppeteer` 24 duplicado).

### `.github/workflows/security.yml`

`ACCEPTED="extract-zip"` → `ACCEPTED="braces"`.

### Documentación

- `SECURITY_AUDIT_ANALYSIS.md`: sección 2026-10-15 con tabla de correcciones, riesgo aceptado
  `braces`, verificación y decisiones.
- `AGENTS.md`: actualizado el gotcha que aún describía `extract-zip` como único aceptado.

## Verificación

| Comprobación | Resultado |
|---|---|
| `pnpm install` (pnpm 10.17.1, sin migración de lockfile) | OK, +36 / −88 |
| `pnpm audit --prod` | **0** |
| `pnpm audit` | **1** (`braces`, aceptado) |
| `pnpm run lint` | OK (solo warnings) |
| `pnpm run test-headless-cc` | 181 tests, 96.98 % lines / **100 % branches** |
| `pnpm run build` | OK |
| `pnpm run a11y` (`pa11y-ci@5.0.0`, con `ng serve`) | config/runners/reporters OK; 1 error de datos en `/curso/12` |

El único error de a11y es un `h1` vacío en `/curso/12` porque **no había backend en `:8080`**
(todos los `HttpErrorResponse` de la API quedan en `status: 0` en el log del dev server). Se
reprodujo idéntico con `pnpm dlx pa11y-ci@4.1.1` sobre el mismo estado de página, por lo que **no
es una regresión del bump** a 5.0.0.

## Decisiones

- `pa11y-ci` 5.0.0 es un major cuyo contenido es un bump de dependencias (pa11y 10, retirada de
  `kleur`), sin cambios de CLI ni de formato de `.pa11yci`: se acepta el salto porque es la única
  forma de eliminar `extract-zip`.
- No subir a Angular 22 (exigiría TypeScript 6) ni forzar `override` del SDK MCP.
- Los PRs Dependabot abiertos (#272–#275) no se fusionan: regeneran el lockfile y perderían los
  overrides de seguridad.

## Estado actual

Completado y verificado localmente. Pendiente: push de la rama, PR (squash) y comprobar que
Dependabot cierra #214/#228/#241/#242/#243 tras el merge; descartar manualmente con motivo
documentado cualquier alerta que quede por metadatos incompletos en la GitHub Advisory Database.
