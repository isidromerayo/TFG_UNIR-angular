# Configuración de Cypress Coverage + SonarQube

## 📋 Resumen

Se ha configurado Cypress para generar reportes de cobertura de código e integrarlos con SonarQube junto con los reportes existentes de Karma/Jasmine.

## 🔧 Configuración Implementada

### Dependencias Añadidas
```json
{
  "@cypress/code-coverage": "^3.13.4",
  "@istanbuljs/nyc-config-typescript": "^1.0.2", 
  "istanbul-lib-coverage": "^3.2.2",
  "lcov-result-merger": "^5.0.1",
  "nyc": "^17.1.0"
}
```

### Archivos Modificados

#### 1. `cypress.config.ts`
- Añadido `setupNodeEvents` con `@cypress/code-coverage/task`
- Configuración para instrumentación automática

#### 2. `cypress/support/component.ts`
- Importado `@cypress/code-coverage/support`
- Habilitado tracking automático de cobertura

#### 3. `.nycrc.json` (nuevo)
- Configuración de NYC para TypeScript
- Exclusiones apropiadas (tests, archivos de configuración)
- Múltiples formatos de reporte (lcov, cobertura, json)

#### 4. `package.json`
- Nuevos scripts para Cypress con cobertura
- Dependencias de cobertura añadidas

#### 5. `sonar-project.properties`
- Actualizado para reconocer múltiples fuentes de cobertura
- Paths para reportes fusionados y individuales

#### 6. `.github/workflows/node.js.yml`
- Paso para ejecutar Cypress con cobertura
- Fusión automática de reportes de Karma y Cypress
- Integración con SonarQube

## 🚀 Comandos Disponibles

```bash
# Tests de componentes Cypress
pnpm run cypress:component

# Abrir Cypress en modo componente
pnpm run cypress:component:open

# Ejecutar tests con cobertura
pnpm run cypress:coverage

# Setup inicial (instalar deps y verificar)
./setup-cypress-coverage.sh
```

## 📊 Reportes de Cobertura

### Ubicaciones
- `coverage/cypress/` - Cobertura de Cypress
- `coverage/frontend-angular/` - Cobertura de Karma/Jasmine  
- `coverage/merged/` - Cobertura fusionada para SonarQube

### Formatos Generados
- **LCOV**: Para SonarQube y herramientas de CI/CD
- **HTML**: Para visualización local
- **Cobertura**: Para Jenkins y otras herramientas
- **JSON**: Para procesamiento programático

## 🔄 Flujo en CI/CD

1. **Karma Tests**: Genera `coverage/frontend-angular/lcov.info`
2. **Cypress Tests**: Genera `coverage/cypress/lcov.info`
3. **Merge**: Fusiona ambos en `coverage/merged/lcov.info`
4. **SonarQube**: Lee el reporte fusionado + individuales como fallback

## 📈 Integración SonarQube

SonarQube está configurado para leer cobertura de múltiples fuentes:
```properties
sonar.typescript.lcov.reportPaths=coverage/merged/lcov.info,coverage/frontend-angular/lcov.info,coverage/cypress/lcov.info
```

Esto asegura que:
- Si existe el reporte fusionado, se usa como principal
- Si falla la fusión, usa reportes individuales
- Máxima compatibilidad y robustez

## 🧪 Test de Ejemplo

Se ha creado `cypress/component/header.component.cy.ts` como ejemplo que:
- Testa el componente HeaderComponent
- Verifica carga de categorías
- Testa estados de login/logout
- Genera cobertura del código del componente

## ⚡ Próximos Pasos

1. **Ejecutar setup**: `./setup-cypress-coverage.sh`
2. **Verificar tests**: `pnpm run cypress:component`
3. **Generar cobertura**: `pnpm run cypress:coverage`
4. **Revisar reportes**: Abrir `coverage/cypress/index.html`
5. **Commit cambios**: Los workflows de CI/CD ya están configurados

## 🔍 Troubleshooting

### Error: "Cannot find module @cypress/code-coverage"
```bash
pnpm install
```

### Coverage no se genera
- Verificar que el código esté instrumentado
- Revisar que los tests ejecuten código real (no mocks completos)
- Comprobar configuración en `.nycrc.json`

### SonarQube no detecta cobertura
- Verificar paths en `sonar-project.properties`
- Comprobar que los archivos `.lcov` existen
- Revisar logs de SonarQube para errores de parsing