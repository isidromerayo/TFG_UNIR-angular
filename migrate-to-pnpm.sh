#!/bin/bash

# Script para migrar de npm a pnpm
# Uso: ./migrate-to-pnpm.sh

set -e

echo "🔄 Migrando de npm a pnpm..."
echo ""

# Verificar si pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm no está instalado."
    echo "📦 Instalando pnpm globalmente..."
    npm install -g pnpm
    echo "✅ pnpm instalado correctamente"
    echo ""
fi

# Mostrar versión de pnpm
echo "📌 Versión de pnpm: $(pnpm --version)"
echo ""

# Limpiar instalación anterior de npm
echo "🧹 Limpiando instalación anterior de npm..."
rm -rf node_modules package-lock.json
echo "✅ Limpieza completada"
echo ""

# Instalar dependencias con pnpm
echo "📦 Instalando dependencias con pnpm..."
pnpm install
echo "✅ Dependencias instaladas"
echo ""

# Verificar build
echo "🔨 Verificando build..."
pnpm run build
echo "✅ Build exitoso"
echo ""

# Verificar tests
echo "🧪 Ejecutando tests..."
pnpm run test-headless
echo "✅ Tests pasaron correctamente"
echo ""

# Verificar audit
echo "🔒 Verificando vulnerabilidades..."
pnpm audit
echo "✅ Audit completado"
echo ""

echo "🎉 Migración completada exitosamente!"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Revisar y commitear pnpm-lock.yaml"
echo "  2. Actualizar documentación del equipo"
echo "  3. Informar al equipo sobre el cambio a pnpm"
echo ""
echo "💡 Comandos útiles:"
echo "  - Instalar dependencias: pnpm install"
echo "  - Agregar paquete: pnpm add <package>"
echo "  - Ejecutar script: pnpm run <script>"
echo "  - Audit: pnpm audit"
