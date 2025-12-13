# SonarQube Configuration for Angular Project

Este documento explica la configuración de SonarQube para el proyecto Angular frontend.

## Archivos de Configuración

### `sonar-project.properties`
Configuración principal de SonarQube con:
- Exclusión de regla S2068 (hard-coded passwords) para archivos de test
- Configuración de rutas LCOV para cobertura de código
- Exclusiones de cobertura para archivos de test, assets y build

### `karma.conf.js`
Ya configurado con reporters LCOV:
- Reporter LCOV habilitado para SonarQube
- Directorio de cobertura: `coverage/frontend-angular/`
- Múltiples formatos: HTML, LCOV, Cobertura, Text-summary

### `.sonarignore`
Patrones de archivos a ignorar completamente por SonarQube.

## Comandos Útiles

### Ejecutar Tests con Cobertura
```bash
# Generar reporte de cobertura completo
pnpm run test-headless-cc
```

### Verificar Archivos de Cobertura
```bash
# Ver archivo LCOV generado
cat coverage/frontend-angular/lcov.info

# Abrir reporte HTML
open coverage/frontend-angular/index.html
```

## Integración con SonarQube Cloud

### ✅ Configuración Actual (GitHub Actions)

El proyecto tiene configurado un **workflow unificado** en `.github/workflows/node.js.yml` que:

1. **Setup del entorno** (Node.js 20, pnpm)
2. **Instalación de dependencias** con caché optimizado
3. **Build del proyecto**
4. **Ejecución de tests con cobertura** (`pnpm run test-headless-cc`)
5. **Auditoría de seguridad**
6. **Análisis de SonarQube** (automático)

### Variables de Entorno Configuradas
```bash
SONAR_TOKEN=${{ secrets.SONAR_TOKEN }}      # ✅ Configurado en GitHub Secrets
GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}    # ✅ Automático de GitHub
```

### Workflow Actual (node.js.yml)
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0  # Requerido por SonarQube
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
    
    - name: Install pnpm
      uses: pnpm/action-setup@v4
      with:
        version: 9
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Build
      run: pnpm run build
    
    - name: Run tests (headless)
      run: pnpm run test-headless-cc  # ✅ Genera cobertura
    
    - name: Audit vulnerabilities
      run: pnpm audit || true
    
    - name: SonarQube Scan
      uses: SonarSource/sonarqube-scan-action@v6
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Flujo de Datos de Cobertura
1. **Tests ejecutados** → `pnpm run test-headless-cc`
2. **LCOV generado** → `coverage/frontend-angular/lcov.info`
3. **SonarQube lee LCOV** → Configurado en `sonar-project.properties`
4. **Métricas enviadas** → SonarQube Cloud

## Métricas de Cobertura Actuales

- **Cobertura de Statements**: 41.66% (120/288)
- **Cobertura de Branches**: 19.04% (4/21)
- **Cobertura de Functions**: 33.88% (41/121)
- **Cobertura de Lines**: 38.11% (93/244)
- **Tests**: 41 tests pasando (7 skipped)

### Estado de Tests
- **Tests Activos**: 41 SUCCESS
- **Tests Deshabilitados**: 7 (marcados con `xit`)
- **Total Tests**: 48 specs

## Resolución de Problemas

### Cobertura No Aparece en SonarQube Cloud

#### 1. Verificar Workflow de GitHub Actions
```bash
# Ir a GitHub → Actions → Ver último workflow
# Verificar que el step "SonarQube Scan" se ejecutó correctamente
```

#### 2. Verificar Generación Local de LCOV
```bash
# Ejecutar localmente para verificar
pnpm run test-headless-cc
ls -la coverage/frontend-angular/lcov.info
```

#### 3. Verificar Configuración de SonarQube
```bash
# Verificar que las rutas son correctas
cat sonar-project.properties | grep lcov
# Debe mostrar: sonar.typescript.lcov.reportPaths=coverage/frontend-angular/lcov.info
```

#### 4. Verificar Secrets de GitHub
- Ir a **Settings** → **Secrets and variables** → **Actions**
- Verificar que existe `SONAR_TOKEN`
- El token debe tener permisos para el proyecto

### Workflow Falla en GitHub Actions

#### Error: "SONAR_TOKEN not found"
```bash
# Solución: Configurar secret en GitHub
# Settings → Secrets → New repository secret
# Name: SONAR_TOKEN
# Value: [token de SonarQube Cloud]
```

#### Error: "No coverage data found"
```bash
# Verificar que los tests se ejecutan antes de SonarQube
# El workflow debe tener este orden:
# 1. pnpm run test-headless-cc
# 2. SonarQube Scan
```

### Reglas de Seguridad en Tests
- Los archivos `**/*.spec.ts` están excluidos de la regla S2068
- Usar comentarios `// NOSONAR` para casos específicos
- Mantener constantes de test claramente marcadas

### Problemas Locales con Karma
```bash
# Si los tests fallan, limpiar y reinstalar
rm -rf node_modules coverage
pnpm install
pnpm run test-headless-cc

# Verificar que se genera el archivo LCOV
ls -la coverage/frontend-angular/lcov.info
```

## Comandos de Verificación

### Verificación Local
```bash
# 1. Verificar configuración de SonarQube
cat sonar-project.properties

# 2. Ejecutar tests y verificar LCOV
pnpm run test-headless-cc && ls -la coverage/frontend-angular/lcov.info

# 3. Ver estadísticas de cobertura
pnpm run test-headless-cc | grep "Coverage summary"

# 4. Verificar estructura completa de cobertura
ls -la coverage/frontend-angular/
```

### Verificación de CI/CD
```bash
# 1. Verificar último workflow en GitHub
# Ir a: https://github.com/isidromerayo/TFG_UNIR-angular/actions

# 2. Verificar análisis en SonarQube Cloud
# Ir a: https://sonarcloud.io/project/overview?id=isidromerayo_TFG_UNIR-angular

# 3. Verificar que el workflow incluye SonarQube
cat .github/workflows/node.js.yml | grep -A 5 "SonarQube Scan"
```

### Verificación de Métricas
```bash
# Verificar que las métricas aparecen en SonarQube Cloud
# 1. Coverage → Debe mostrar porcentaje > 0%
# 2. Lines to Cover → Debe mostrar número de líneas
# 3. Quality Gate → Debe evaluar cobertura
```

## Mejoras Recomendadas

### Aumentar Cobertura de Tests
1. **Habilitar tests deshabilitados**: Revisar los 7 tests con `xit`
2. **Agregar tests faltantes**: Especialmente para branches (19.04%)
3. **Tests de integración**: Para flujos completos de usuario
4. **Tests de servicios**: Mejorar cobertura de funciones (33.88%)

### Objetivos de Cobertura
- **Statements**: Objetivo 80% (actual 41.66%)
- **Branches**: Objetivo 80% (actual 19.04%)
- **Functions**: Objetivo 80% (actual 33.88%)
- **Lines**: Objetivo 80% (actual 38.11%)

## Integración con Flujo de Desarrollo

### Workflow Recomendado
Según `AGENTS.md`, el flujo obligatorio es:

```bash
# 1. Ejecutar tests
pnpm run test-headless

# 2. Verificar build
pnpm run build

# 3. Verificar seguridad
pnpm audit

# 4. Solo entonces hacer commit
git add .
git commit -m "descripción"
```

### Para Cobertura en CI/CD
```bash
# Comando completo con cobertura
pnpm run test-headless-cc && pnpm run build && pnpm audit
```

## Estado del Workflow

### ✅ Configuración Completada
- **GitHub Actions**: Workflow unificado en `node.js.yml`
- **SonarQube Cloud**: Proyecto configurado como `isidromerayo_TFG_UNIR-angular`
- **Secrets**: `SONAR_TOKEN` configurado en GitHub
- **Cobertura**: LCOV generado automáticamente en cada CI/CD

### 🔄 Triggers Automáticos
- **Push a main**: Ejecuta análisis completo
- **Pull Requests**: Ejecuta análisis de PR con comparación
- **Cobertura**: Enviada automáticamente a SonarQube Cloud

### 📊 Monitoreo
- **SonarQube Cloud**: https://sonarcloud.io/project/overview?id=isidromerayo_TFG_UNIR-angular
- **GitHub Actions**: Ver en la pestaña "Actions" del repositorio
- **Reportes locales**: `coverage/frontend-angular/index.html`

## Archivos Importantes

### Configuración
- `sonar-project.properties` - Configuración principal de SonarQube
- `.sonarignore` - Exclusiones de archivos
- `.github/workflows/node.js.yml` - Workflow de CI/CD unificado
- `karma.conf.js` - Configuración de testing y cobertura

### Reportes Generados
- `coverage/frontend-angular/lcov.info` - Archivo LCOV para SonarQube
- `coverage/frontend-angular/index.html` - Reporte HTML interactivo
- `coverage/frontend-angular/cobertura-coverage.xml` - Formato Cobertura