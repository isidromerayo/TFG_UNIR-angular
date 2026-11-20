# 🔖 Guía de Gestión de Versiones

Este documento describe el versionado del proyecto **TFG UNIR - Frontend Angular** y el proceso
de release que despliega la imagen en el homelab.

## 📊 Estado Actual
- **Versión Actual**: `0.4.0` (definida en `package.json`; `main` queda siempre en la última
  versión publicada, sin versiones de desarrollo intermedias).
- **Convención de Mensajes**: [Conventional Commits](https://www.conventionalcommits.org/).
- **Versión desplegada**: la última GitHub Release. El poller del CT 110
  (`tfg-angular-deploy-poller.timer`) la despliega en `https://tfg-angular.estilolibre.eu`.

---

## 🚀 Proceso recomendado: workflow `Release` (automatizado)

En GitHub Actions → **Release** → *Run workflow* con `release_version` (X.Y.Z). El workflow:

1. Valida que la versión sea semver (`X.Y.Z`).
2. Si `package.json` **no** está ya en esa versión, crea la rama `release/X.Y.Z`, sube el
   `package.json`, abre un PR y lo mergea con squash (main nunca recibe pushes directos).
   Si ya coincide (la funcionalidad subió la versión en su propio PR), se salta este paso.
3. Crea y empuja el tag anotado `vX.Y.Z` sobre `main`.
4. Construye y publica `isidromerayo/frontend-angular-tfg:X.Y.Z` y `:latest` en Docker Hub.
5. Crea la GitHub Release con notas generadas.
6. El poller del homelab detecta la release (≤10 min) y despliega en Coolify.

También admite `dry_run` (valida, pero no hace PR, push, Docker ni release).

### Secretos necesarios en el repositorio

| Secreto | Uso |
|---|---|
| `RELEASE_TOKEN` | PAT con `Contents: Read and write` y `Pull requests: Read and write` (crear/mergear el PR de release y crear la GitHub Release) |
| `DOCKER_HUB_USERNAME` | Usuario de Docker Hub |
| `DOCKER_HUB_TOKEN` | Token de Docker Hub |

---

## 🛠️ Flujo manual (fallback)

Si el workflow no está disponible:

```bash
# 1. Rama de release (main no se toca directamente)
git checkout -b release/X.Y.Z
pnpm pkg set version=X.Y.Z
git add package.json
git commit -m "chore(release): X.Y.Z"
git push origin release/X.Y.Z
# 2. Abrir y mergear el PR (squash) y, desde main actualizado:
git checkout main
git pull origin main
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z

# 3. Imagen y GitHub Release
docker build --build-arg VERSION=X.Y.Z \
  -t isidromerayo/frontend-angular-tfg:X.Y.Z \
  -t isidromerayo/frontend-angular-tfg:latest .
docker push isidromerayo/frontend-angular-tfg:X.Y.Z
docker push isidromerayo/frontend-angular-tfg:latest
gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes
```

**Note:** Direct commits or pushes to `main` are not allowed, including release commits.

---

## ✅ Checklist para una Release
- [ ] Todos los tests pasan (`pnpm test-headless`)
- [ ] El build es exitoso (`pnpm run build`)
- [ ] No hay vulnerabilidades críticas (`pnpm audit`)
- [ ] El código está actualizado en la rama principal
- [ ] La release queda desplegada (`https://tfg-angular.estilolibre.eu` responde y el poller
      registra `latest=current=confirmed`)
