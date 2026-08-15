# 🔖 Guía de Gestión de Versiones

Este documento describe las opciones y el flujo de trabajo recomendado para gestionar el versionado del proyecto **TFG UNIR - Frontend Angular**.

## 📊 Estado Actual
- **Versión Actual**: `0.2.3` (definida en `package.json`)
- **Convención de Mensajes**: Se recomienda seguir [Conventional Commits](https://www.conventionalcommits.org/).

---

## 🛠️ Opciones de Gestión

### 1. Gestión Manual (Básica)
Ideal para control total sin dependencias extra.

*   **Comandos**:
    ```bash
    pnpm version patch  # 0.1.0 -> 0.1.1 (Correcciones)
    pnpm version minor  # 0.1.0 -> 0.2.0 (Nuevas funcionalidades)
    pnpm version major  # 0.1.0 -> 1.0.0 (Breaking changes)
    ```
*   **Qué hace**: Actualiza `package.json`, crea un commit de versión y un tag de Git.
*   **Pros**: Simple, sin configuración.
*   **Contras**: No hay CHANGELOG automático.

### 2. Automatización Local (Recomendado)
Uso de `standard-version` para automatizar el versionado y el historial de cambios.

*   **Instalación**: `pnpm add -D standard-version`
*   **Script en package.json**: `"release": "standard-version"`
*   **Uso**:
    ```bash
    pnpm run release
    ```
*   **Qué hace**: 
    1. Analiza commits desde el último tag.
    2. Sube la versión según el tipo de cambios (`feat`, `fix`).
    3. Genera/Actualiza `CHANGELOG.md`.
    4. Crea commit y tag de Git.
*   **Pros**: Historial profesional y automático.

### 3. Automatización Total (CI/CD)
Uso de `semantic-release` en GitHub Actions.

*   **Flujo**: Al hacer merge en `main`, un runner de GitHub gestiona todo.
*   **Pros**: Elimina la necesidad de gestionar versiones localmente. Totalmente desatendido.
*   **Contras**: Configuración inicial más compleja.

---

## 🚀 Flujo de Trabajo Sugerido

Para este proyecto, se recomienda la **Opción 2** combinada con **Conventional Commits**:

1.  **Desarrollo**: Realizar commits descriptivos:
    - `feat: añadir sistema de valoraciones`
    - `fix: corregir error en el carrito`
2.  **Release**: Cuando el código esté listo en `main`:
    ```bash
    git checkout -b release/X.Y.Z
    pnpm version X.Y.Z --no-git-tag-version
    git add package.json
    git commit -m "chore(release): X.Y.Z"
    git push origin release/X.Y.Z
    # Open and merge the Pull Request, then from the updated main branch:
    git checkout main
    git pull origin main
    git tag -a vX.Y.Z -m "vX.Y.Z"
    git push origin vX.Y.Z
    gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes
    ```
    **Note:** Direct commits or pushes to `main` are not allowed, including release commits.

---

## ✅ Checklist para una Release
- [ ] Todos los tests pasan (`pnpm test-headless`)
- [ ] El build es exitoso (`pnpm run build`)
- [ ] No hay vulnerabilidades críticas (`pnpm audit`)
- [ ] El código está actualizado en la rama principal
