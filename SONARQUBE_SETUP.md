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

### Configuración en CI/CD
Para que SonarQube Cloud reciba la cobertura correctamente:

1. **Ejecutar tests con cobertura** antes del análisis de SonarQube
2. **Verificar que existe** `coverage/frontend-angular/lcov.info`
3. **Configurar las variables** de entorno necesarias

### Variables de Entorno Requeridas
```bash
SONAR_TOKEN=your_sonar_token
SONAR_HOST_URL=https://sonarcloud.io
```

### Ejemplo de GitHub Actions
```yaml
- name: Install dependencies
  run: pnpm install

- name: Run tests with coverage
  run: pnpm run test-headless-cc

- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

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

### Cobertura No Aparece en SonarQube
1. Verificar que `coverage/frontend-angular/lcov.info` existe
2. Comprobar rutas en `sonar-project.properties`
3. Asegurar que el análisis se ejecuta después de los tests
4. Verificar que la ruta LCOV coincide con la estructura de directorios

### Reglas de Seguridad en Tests
- Los archivos de test están excluidos de la regla S2068
- Usar comentarios `// NOSONAR` para casos específicos
- Mantener constantes de test claramente marcadas

### Problemas con Karma
```bash
# Si los tests fallan, limpiar y reinstalar
rm -rf node_modules coverage
pnpm install
pnpm run test-headless-cc
```

## Comandos de Verificación

```bash
# Verificar configuración de SonarQube
cat sonar-project.properties

# Verificar que LCOV se genera
pnpm run test-headless-cc && ls -la coverage/frontend-angular/lcov.info

# Ver estadísticas de cobertura
pnpm run test-headless-cc | grep "Coverage summary"

# Verificar estructura de archivos de cobertura
ls -la coverage/frontend-angular/
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

## Archivos Importantes

- `karma.conf.js` - Configuración de testing y cobertura
- `sonar-project.properties` - Configuración de SonarQube
- `.sonarignore` - Exclusiones de SonarQube
- `coverage/frontend-angular/lcov.info` - Archivo de cobertura para SonarQube
- `coverage/frontend-angular/index.html` - Reporte HTML de cobertura