# Migración de npm a pnpm

Este documento describe el proceso de migración del proyecto de npm a pnpm.

## ¿Por qué pnpm?

### Ventajas de pnpm sobre npm

1. **Seguridad mejorada**
   - Previene dependencias fantasma (phantom dependencies)
   - Resolución estricta de dependencias peer
   - Aislamiento de paquetes mediante enlaces simbólicos

2. **Rendimiento**
   - Instalación hasta 2x más rápida que npm
   - Caché global eficiente
   - Instalaciones paralelas optimizadas

3. **Eficiencia de espacio en disco**
   - Almacenamiento content-addressable
   - Los paquetes se almacenan una sola vez globalmente
   - Enlaces duros en lugar de copias

4. **Mejor soporte para monorepos**
   - Workspace nativo y eficiente
   - Gestión de dependencias entre paquetes

## Cambios realizados

### 1. Archivos de configuración

#### `.npmrc` (nuevo)
```
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
public-hoist-pattern[]=*@babel*
public-hoist-pattern[]=*@angular*
```

- `shamefully-hoist=true`: Necesario para compatibilidad con Angular y herramientas de build
- `strict-peer-dependencies=false`: Permite flexibilidad con peer dependencies
- `auto-install-peers=true`: Instala automáticamente peer dependencies
- `public-hoist-pattern`: Eleva paquetes específicos para resolver problemas de resolución de módulos

#### `pnpm-workspace.yaml` (nuevo)
Define el workspace del proyecto.

### 2. CI/CD - GitHub Actions

**Archivo**: `.github/workflows/node.js.yml`

Cambios principales:
- Actualización de actions a v4
- Instalación de pnpm mediante `pnpm/action-setup@v4`
- Configuración de caché para pnpm store
- Reemplazo de comandos npm por pnpm

```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 9

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

### 3. Documentación

**Archivo**: `README.md`

- Sección sobre pnpm como package manager
- Instrucciones de instalación de pnpm
- Actualización de todos los comandos de npm a pnpm
- Explicación de beneficios de pnpm

## Pasos para migrar (para desarrolladores)

### 1. Instalar pnpm

```bash
npm install -g pnpm
```

O usando otros métodos: https://pnpm.io/installation

### 2. Limpiar instalación anterior de npm

```bash
# Eliminar node_modules y package-lock.json
rm -rf node_modules package-lock.json
```

### 3. Instalar dependencias con pnpm

```bash
pnpm install
```

Esto generará un archivo `pnpm-lock.yaml` que debe ser commiteado al repositorio.

### 4. Verificar que todo funciona

```bash
# Build
pnpm run build

# Tests
pnpm run test-headless

# Audit
pnpm audit
```

## Comandos equivalentes

| npm | pnpm |
|-----|------|
| `npm install` | `pnpm install` |
| `npm install <pkg>` | `pnpm add <pkg>` |
| `npm install -D <pkg>` | `pnpm add -D <pkg>` |
| `npm uninstall <pkg>` | `pnpm remove <pkg>` |
| `npm run <script>` | `pnpm run <script>` o `pnpm <script>` |
| `npm test` | `pnpm test` |
| `npm audit` | `pnpm audit` |
| `npm update` | `pnpm update` |
| `npx <command>` | `pnpm dlx <command>` |

## Archivos a ignorar en .gitignore

Asegúrate de que `.gitignore` incluya:

```
node_modules/
.pnpm-store/
pnpm-debug.log*
```

## Troubleshooting

### Problema: Peer dependency warnings

Si ves warnings sobre peer dependencies, puedes:
1. Instalar manualmente: `pnpm add <peer-dep>`
2. Ajustar `.npmrc` con `strict-peer-dependencies=false`

### Problema: Phantom dependencies

Si el código dependía de paquetes no declarados (phantom dependencies):
1. Identifica el paquete faltante
2. Agrégalo explícitamente: `pnpm add <pkg>`

### Problema: Scripts no funcionan

Verifica que los scripts en `package.json` no usen comandos específicos de npm.

## Referencias

- [Documentación oficial de pnpm](https://pnpm.io/)
- [Migración desde npm](https://pnpm.io/cli/import)
- [pnpm vs npm](https://pnpm.io/feature-comparison)
- [Benchmarks](https://pnpm.io/benchmarks)

## Notas adicionales

- El archivo `pnpm-lock.yaml` debe ser commiteado al repositorio
- En CI/CD, usar `pnpm install --frozen-lockfile` para instalaciones determinísticas
- pnpm es compatible con la mayoría de herramientas del ecosistema Node.js
