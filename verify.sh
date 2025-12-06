#!/bin/bash

# Script de verificación pre-commit
# Uso: ./verify.sh

set -e

echo "🔍 Verificación Pre-Commit"
echo "=========================="
echo ""

# Tests
echo "📝 Ejecutando tests..."
pnpm run test-headless
if [ $? -eq 0 ]; then
  echo "✅ Tests: PASS"
else
  echo "❌ Tests: FAIL"
  exit 1
fi
echo ""

# Build
echo "🔨 Ejecutando build..."
pnpm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Build: PASS"
else
  echo "❌ Build: FAIL"
  exit 1
fi
echo ""

# Audit
echo "🔒 Verificando seguridad..."
pnpm audit > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Audit: PASS (0 vulnerabilities)"
else
  echo "⚠️  Audit: Vulnerabilities found"
fi
echo ""

echo "=========================="
echo "✅ Todas las verificaciones pasaron!"
echo "🎉 Listo para commit"
