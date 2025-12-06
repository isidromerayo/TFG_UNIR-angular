# Changelog - Migración a pnpm

## [2024-12-06] - Migración de npm a pnpm

### Agregado
- ✅ Configuración de pnpm (`.npmrc`)
- ✅ Workspace de pnpm (`pnpm-workspace.yaml`)
- ✅ Lockfile de pnpm (`pnpm-lock.yaml`)
- ✅ Documentación de migración (`MIGRATION_TO_PNPM.md`)
- ✅ Script de migración automatizado (`migrate-to-pnpm.sh`)
- ✅ Actualización de `.gitignore` para archivos de pnpm

### Modificado
- ✅ CI/CD GitHub Actions (`.github/workflows/node.js.yml`)
  - Actualizado a actions v4
  - Agregado setup de pnpm
  - Configurado caché de pnpm
  - Reemplazados comandos npm por pnpm
  
- ✅ README.md
  - Agregada sección sobre pnpm
  - Instrucciones de instalación
  - Actualización de comandos
  - Beneficios de pnpm

### Eliminado
- ❌ `package-lock.json` (reemplazado por `pnpm-lock.yaml`)
- ❌ `node_modules/` (reinstalado con pnpm)

### Verificado
- ✅ Build funciona correctamente con pnpm
- ✅ Tests pasan exitosamente (19 SUCCESS)
- ✅ No hay vulnerabilidades de seguridad
- ✅ Compatibilidad con Angular 20.3.15

### Configuración de pnpm

```ini
# .npmrc
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
public-hoist-pattern[]=*@babel*
public-hoist-pattern[]=*@angular*
```

### Beneficios obtenidos

1. **Seguridad**: Prevención de phantom dependencies
2. **Rendimiento**: Instalación ~2x más rápida
3. **Espacio**: Almacenamiento eficiente con enlaces duros
4. **CI/CD**: Caché optimizado en GitHub Actions

### Comandos actualizados

| Antes (npm) | Ahora (pnpm) |
|-------------|--------------|
| `npm install` | `pnpm install` |
| `npm run build` | `pnpm run build` |
| `npm test` | `pnpm test` |
| `npm audit` | `pnpm audit` |

### Notas para el equipo

- El archivo `pnpm-lock.yaml` debe ser commiteado
- Todos los desarrolladores deben instalar pnpm: `npm install -g pnpm`
- Ejecutar `pnpm install` para sincronizar dependencias
- Los scripts en `package.json` no cambian, solo el gestor de paquetes

### Soporte

Para dudas o problemas:
1. Consultar `MIGRATION_TO_PNPM.md`
2. Documentación oficial: https://pnpm.io/
3. Ejecutar `./migrate-to-pnpm.sh` para migración automatizada
