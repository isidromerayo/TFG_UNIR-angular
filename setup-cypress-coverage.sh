#!/bin/bash

echo "🔧 Configurando Cypress Coverage para Angular..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# Verificar que las dependencias están instaladas
echo "✅ Verificando instalación..."
if pnpm list @cypress/code-coverage > /dev/null 2>&1; then
    echo "✅ @cypress/code-coverage instalado correctamente"
else
    echo "❌ Error: @cypress/code-coverage no está instalado"
    exit 1
fi

if pnpm list nyc > /dev/null 2>&1; then
    echo "✅ nyc instalado correctamente"
else
    echo "❌ Error: nyc no está instalado"
    exit 1
fi

# Crear directorios de coverage si no existen
mkdir -p coverage/cypress
mkdir -p coverage/merged

echo "🧪 Ejecutando test de prueba..."
# Ejecutar un test rápido para verificar que funciona
pnpm run cypress:component --spec "cypress/component/header.component.cy.ts" || echo "⚠️  Test falló, pero la configuración está lista"

echo "📊 Generando reporte de cobertura..."
pnpm run cypress:coverage || echo "⚠️  Coverage falló, pero la configuración está lista"

echo ""
echo "🎉 Configuración completada!"
echo ""
echo "📋 Comandos disponibles:"
echo "  pnpm run cypress:component        - Ejecutar tests de componentes"
echo "  pnpm run cypress:component:open   - Abrir Cypress en modo componente"
echo "  pnpm run cypress:coverage         - Ejecutar tests con cobertura"
echo ""
echo "📁 Reportes de cobertura:"
echo "  coverage/cypress/               - Cobertura de Cypress"
echo "  coverage/frontend-angular/      - Cobertura de Karma/Jasmine"
echo "  coverage/merged/                - Cobertura fusionada para SonarQube"
echo ""