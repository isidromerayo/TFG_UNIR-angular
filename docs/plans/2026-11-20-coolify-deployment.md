# Plan de despliegue en Coolify — TFG_UNIR-angular

**Fecha:** 2026-11-20
**Proyecto:** TFG_UNIR-angular
**Herramienta/modelo:** OpenCode (DeepSeek V4.1 Flash)
**Estado:** En curso
**Prioridad:** Alta (fase 5 del homelab: CI/CD para el resto de apps)

---

## 🎯 Objetivos

1. **Externalizar la URL de la API** con entornos de Angular (`environment.ts` / `environment.prod.ts`).
2. **Construir una imagen Docker** de producción (build con pnpm + nginx con fallback SPA).
3. **Publicar releases** (`release.yml`): versión, tag, imagen en Docker Hub y GitHub Release.
4. **Desplegar en Coolify** en `https://tfg-angular.estilolibre.eu` mediante el poller de releases
   del homelab (repo `homelab-proxmox`).
5. **Subir el toolchain a Node 24 LTS** (Node 22 acaba soporte en abril de 2027).

---

## 📦 Cambios

### Toolchain / CI

- Node `22.22.3` → `24.22.3` en `node.js.yml`, `tests.yml`, `security.yml`, `a11y.yml` y en el
  nuevo `release.yml`.
- `README.md`, `CONTRIBUTING.md` y `AGENTS.md` actualizados a Node 24 y al nuevo flujo.

### Aplicación

- `src/environments/environment.ts` (dev, `http://localhost:8080/api`).
- `src/environments/environment.prod.ts` (producción, `https://tfg-api.estilolibre.eu/api`).
- `angular.json`: `fileReplacements` en la configuración `production` (es la default, así que
  `pnpm run build` usa el entorno de producción).
- `src/app/utils/constants.ts`: `API_URL = environment.apiUrl` (los servicios no cambian).

### Empaquetado y despliegue

- `Dockerfile` multi-stage (`node:24-alpine` + corepack/pnpm → `nginx-unprivileged:1.30-alpine`),
  con `USER nginx` explícito y puerto 8080 (sin root en runtime).
- `nginx.conf`: fallback SPA, caché de assets con hash, `index.html` sin caché.
- `.dockerignore`.
- `.github/workflows/release.yml`: si la versión no coincide, crea `release/X.Y.Z` + PR + squash
  (sin push directo a `main`), etiqueta `vX.Y.Z`, publica
  `isidromerayo/frontend-angular-tfg:<versión>` + `latest`, crea la GitHub Release y el poller la
  despliega.
- `package.json` a **0.4.0** (nueva funcionalidad: despliegue) y `VERSIONING_GUIDE.md` actualizado
  con el proceso automatizado.

---

## ✅ Verificación

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run build` (comprueba que la build usa `environment.prod.ts`)
- `pnpm run test-headless` (Karma, entorno de desarrollo)
- `docker build` local y smoke test del contenedor (`/` y una ruta profunda como `/home`) en el
  puerto 8080, comprobando que el proceso corre como `nginx` (no root).

---

## 🧠 Decisiones de diseño

- **Entornos de Angular en build time** (en vez de `config.json` en runtime): el requisito es un
  backend fijo por despliegue y así no hay cambios en `main.ts` ni en el arranque de la app.
- **Imagen estática con nginx no privilegiado** en vez de SSR: la app es una SPA; nginx pesa
  ~10 MB y encaja con el patrón de Coolify (Docker image + dominio + healthcheck). Se usa
  `nginxinc/nginx-unprivileged` con `USER nginx` (uid 101) y puerto 8080 para no ejecutar root.
- **Release mediante PR** (`release/X.Y.Z`) y no push directo a `main`, siguiendo la política de
  ramas del repo; el workflow mergea con squash y después etiqueta.
- **Build en GitHub Actions → Docker Hub → Coolify**: recomendado en el runbook del homelab; evita
  compilar en el CT 110 (4 vCPU / 8 GB compartidos).
- **Deployment por release** (poller cada 10 min) para mantener el mismo mecanismo idempotente que
  el backend; el CD push por Tailscale queda pendiente de los secretos `TS_OAUTH_*`.

---

## 📌 Fuera de alcance

- Crear el recurso en la UI de Coolify y el `.env` del poller: se documenta en
  `homelab-proxmox/docs/apps/tfg-angular-frontend.md` (requiere acceso al CT 110).
