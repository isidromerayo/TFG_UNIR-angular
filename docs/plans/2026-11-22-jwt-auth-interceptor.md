# 2026-11-22 — JWT en la cabecera Authorization + token desde el body

**Fecha:** 2026-11-22
**Herramienta / modelo:** OpenCode (Qwen3.8 Flash)
**Origen:** `TFG_UNIR-backend/docs/security/plan-impacto-frontends-2026-11-10.md` §4.2 (la
contraseña 8-72 ya estaba en `main` por #303/#305).

## Estado

**done** (rama `fix/auth-token-interceptor`, PR #308).

## Qué fallaba

`auth.service.ts` leía el JWT de una cabecera `Authorization` que el backend nunca devolvió
(`LoginController` responde `AuthResponse` en el **cuerpo**): se guardaba `"undefined"` en
`localStorage` y ninguna petición llevaba credenciales → los endpoints protegidos
(`/usuarios/{id}/cursos`, compras) eran inalcanzables con sesión real.

## Cambios

| Archivo | Cambio |
|---------|--------|
| `src/app/services/auth.service.ts` | Token leído del cuerpo de la respuesta; fin del `"undefined"`. |
| `src/app/interceptors/auth.interceptor.ts` (nuevo) | Funcional: añade `Authorization: Bearer <token>` a rutas protegidas; omite POST `/auth`, POST `/usuarios` y GETs de catálogo público (evita preflights CORS inútiles); ignora el token legado `'undefined'`. |
| `src/app/interceptors/sesion.interceptor.ts` (nuevo) | 401 protegido → logout + "sesión caducada" + `/acceso`; 403 → aviso sin logout; el 401/403 del login se delega al componente de acceso. |
| `src/app/utils/api-error.ts` (nuevo) | `ApiError`/`formatError` compartidos (antes vivían en `registro.component.ts`) + `retryAfterSeconds`/`authErrorMessage`. Cierra el P1 "mapeo de errores compartido" del plan de CI 2026-11-20. |
| `src/app/components/acceso` | Mensajes específicos 401/403/429 (con `Retry-After`). |
| `src/main.ts` | `provideHttpClient(withInterceptors([authInterceptor, sesionInterceptor]))` — vuelve a ser necesario ahora que sí hay interceptores (en v22 estaba retirado por redundante sin ellos, ver openspec del upgrade). |

## Verificación

- `pnpm run test-headless` → 213/213 (32 tests nuevos: `api-error.spec`, `auth.interceptor.spec`,
  `sesion.interceptor.spec`, acceso 401/429).
- `pnpm run test-headless-cc` → branches 100% (58/58), lines 97.5%.
- `pnpm run build` → OK; `pnpm audit --prod` → 0 vulnerabilidades.
- Los tests de `auth.service.spec.ts` que fijaban el bug (cabecera → `"undefined"`) se
  reemplazan por asserts del token en el cuerpo.

## Notas

- El E2E no fija textos de mensajes ni el 401 de login → sin roturas en `spec.cy.ts`.
- La parte §4.1 de tests de contrato con backend real queda en el plan de CI
  (`2026-11-20-ci-contract-improvements`, P1).
