# Actualización del Workflow de GitHub Actions

## ⚠️ Problema

El push falló porque el token OAuth no tiene el scope `workflow` necesario para modificar archivos en `.github/workflows/`.

## 📝 Solución

Actualizar el archivo `.github/workflows/node.js.yml` **manualmente en GitHub** con los siguientes cambios:

### Cambios Necesarios

#### 1. Actualizar versiones de actions

```yaml
# Antes
- uses: actions/checkout@v2
- uses: actions/setup-node@v2

# Después
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
```

#### 2. Agregar setup de pnpm

Agregar después del step "Setup Node.js":

```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 9

- name: Get pnpm store directory
  shell: bash
  run: |
    echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

- name: Setup pnpm cache
  uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-
```

#### 3. Cambiar comandos npm por pnpm

```yaml
# Antes
- name: Install dependencies
  run: npm install --force

- name: Build
  run: npm run build

- name: Run tests (headless)
  run: npm run test-headless-cc

- name: Audit vulnerabilities
  run: |
    npm audit || EXIT_CODE=$?
    if [ $EXIT_CODE -ne 0 ]; then
      echo "npm audit found vulnerabilities."
    else
      echo "npm audit found no vulnerabilities."
    fi

# Después
- name: Install dependencies
  run: pnpm install --frozen-lockfile

- name: Build
  run: pnpm run build

- name: Run tests (headless)
  run: pnpm run test-headless-cc

- name: Audit vulnerabilities
  run: |
    pnpm audit || EXIT_CODE=$?
    if [ $EXIT_CODE -ne 0 ]; then
      echo "pnpm audit found vulnerabilities."
    else
      echo "pnpm audit found no vulnerabilities."
    fi
```

## 📋 Archivo Completo

```yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'

    - name: Install pnpm
      uses: pnpm/action-setup@v4
      with:
        version: 9

    - name: Get pnpm store directory
      shell: bash
      run: |
        echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

    - name: Setup pnpm cache
      uses: actions/cache@v4
      with:
        path: ${{ env.STORE_PATH }}
        key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
        restore-keys: |
          ${{ runner.os }}-pnpm-store-

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Build
      run: pnpm run build

    - name: Run tests (headless)
      run: pnpm run test-headless-cc

    - name: Audit vulnerabilities
      run: |
        pnpm audit || EXIT_CODE=$?
        if [ $EXIT_CODE -ne 0 ]; then
          echo "pnpm audit found vulnerabilities."
        else
          echo "pnpm audit found no vulnerabilities."
        fi
```

## 🔧 Pasos para Actualizar

1. Ve a GitHub: `https://github.com/isidromerayo/TFG_UNIR-angular`
2. Navega a `.github/workflows/node.js.yml`
3. Haz clic en el botón "Edit" (lápiz)
4. Reemplaza el contenido con el archivo completo de arriba
5. Commit directamente a la rama `main` o `npm_audit_fix`
6. El workflow se actualizará automáticamente

## ✅ Verificación

Después de actualizar, el workflow debería:
- Usar pnpm en lugar de npm
- Tener caché configurado
- Ejecutar tests y build correctamente

## 📌 Nota

Este cambio es parte del commit `d30de3d` que no pudo ser pusheado debido a restricciones de permisos del token OAuth.
