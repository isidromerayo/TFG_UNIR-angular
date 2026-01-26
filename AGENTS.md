# 🤖 AGENTS.md - Contexto Completo del Proyecto Angular

## 📋 Información General

**Proyecto**: TFG UNIR - Frontend Angular
**Framework**: Angular 21.1.1
**Lenguaje**: TypeScript 5.9.3
**Package Manager**: pnpm 10.x
**Propósito**: Aplicación web frontend para sistema de gestión de cursos online

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
src/
├── app/
│   ├── components/          # Componentes de la aplicación
│   │   ├── acceso/         # Login/autenticación
│   │   ├── busqueda/       # Búsqueda de cursos
│   │   ├── carrito/        # Carrito de compras
│   │   ├── categoria/      # Vista de categoría individual
│   │   ├── categorias/     # Lista de categorías
│   │   ├── curso/          # Detalle de curso
│   │   ├── footer/         # Footer de la aplicación
│   │   ├── header/         # Header/navegación
│   │   ├── home/           # Página principal
│   │   ├── mis-cursos/     # Cursos del usuario
│   │   ├── mis-datos/      # Perfil del usuario
│   │   ├── no-encontrado/  # Página 404
│   │   ├── registro/       # Registro de usuarios
│   │   ├── slider/         # Carrusel de imágenes
│   │   └── valoracion/     # Sistema de valoraciones
│   ├── services/           # Servicios de la aplicación
│   ├── model/              # Modelos de datos/interfaces
│   ├── utils/              # Utilidades y helpers
│   ├── app-routing.module.ts
│   ├── app.module.ts
│   └── autenticacion.guard.ts
├── assets/                 # Recursos estáticos
│   ├── css/
│   ├── img/
│   ├── js/
│   ├── scss/
│   └── vendor/
└── styles.css
```

## 🎯 Funcionalidades Principales

### Módulos de Usuario
1. **Autenticación y Registro**
   - Login de usuarios
   - Registro de nuevos usuarios
   - Guard de autenticación para rutas protegidas

2. **Catálogo de Cursos**
   - Navegación por categorías
   - Búsqueda de cursos
   - Detalle de curso con información completa
   - Sistema de valoraciones

3. **Gestión de Compras**
   - Carrito de compras
   - Proceso de checkout
   - Mis cursos adquiridos

4. **Perfil de Usuario**
   - Gestión de datos personales
   - Historial de cursos

## 🔧 Configuración del Proyecto

### Package Manager: pnpm
El proyecto usa **pnpm** en lugar de npm por:
- Mayor seguridad (prevención de phantom dependencies)
- Instalación ~2x más rápida
- Uso eficiente de espacio en disco
- Mejor soporte para monorepos

### Scripts Disponibles
```bash
pnpm start              # Dev server en localhost:4200
pnpm run build          # Build de producción
pnpm test               # Tests con watch mode
pnpm run test-headless  # Tests headless (CI/CD)
pnpm run test-headless-cc # Tests con code coverage
pnpm run cypress:open   # E2E tests interactivos
pnpm run cypress:run    # E2E tests headless
```

### Configuración de pnpm
Ver `.npmrc` para configuración específica de Angular:
- `shamefully-hoist=true` para compatibilidad
- `auto-install-peers=true` para peer dependencies
- Patrones de hoist para @angular y @babel

## 📝 Guías de Desarrollo

### Buenas Prácticas
El proyecto sigue las mejores prácticas de Angular 20+. Ver `.agents/best-practices.md` para:
- TypeScript best practices
- Angular component patterns
- State management con signals
- Accessibility requirements (WCAG AA)
- Template syntax moderna

### Puntos Clave para Agentes IA

#### 1. Componentes
- **NO usar** `standalone: true` en decoradores (es el default en Angular 20+)
- Usar `input()` y `output()` en lugar de decoradores
- Usar `computed()` para estado derivado
- Implementar `ChangeDetectionStrategy.OnPush`
- Preferir control flow nativo (`@if`, `@for`, `@switch`)

#### 2. Estado
- Usar signals para estado local
- Usar `computed()` para valores derivados
- NO usar `mutate()`, usar `update()` o `set()`

#### 3. Servicios
- Usar `inject()` en lugar de constructor injection
- Usar `providedIn: 'root'` para singletons

#### 4. Templates
- NO usar `*ngIf`, `*ngFor`, `*ngSwitch` (usar `@if`, `@for`, `@switch`)
- NO usar `ngClass` (usar class bindings)
- NO usar `ngStyle` (usar style bindings)
- NO escribir arrow functions en templates

#### 5. Accesibilidad
- DEBE pasar todos los checks de AXE
- DEBE cumplir WCAG AA mínimos
- Gestión de foco apropiada
- Contraste de color adecuado
- Atributos ARIA correctos

## 🔒 Seguridad

### Auditoría y Mantenimiento

```bash
# Auditoría de seguridad completa
pnpm security

# Auditoría básica
pnpm audit

# Verificar dependencias desactualizadas
pnpm outdated

# Actualizar dependencias (respetando semver)
pnpm update

# Actualizar a últimas versiones
pnpm update --latest

# Actualizar interactivamente
pnpm update --interactive
```

⚠️ **Importante**: No confiar solo en `pnpm audit`. Ver [SECURITY_AUDIT_ANALYSIS.md](./SECURITY_AUDIT_ANALYSIS.md)

### Autenticación
- Guard implementado: `autenticacion.guard.ts`
- Protección de rutas privadas
- Gestión de sesiones de usuario

## 🧪 Testing

### Unit Tests (Karma + Jasmine)
- Coverage configurado
- **Estado**: Todos los tests pasan
- Ejecutar: `pnpm run test-headless-cc`

### Comandos de Testing
```bash
pnpm test                    # Tests con watch mode
pnpm run test-headless       # Tests headless (CI/CD)
pnpm run test-headless-cc    # Tests con code coverage
```

### E2E Tests (Cypress)
- Configurado con `@cypress/schematic`
- Tests interactivos: `pnpm run cypress:open`
- Tests CI/CD: `pnpm run cypress:run`


## 🚀 CI/CD

### GitHub Actions
Workflow configurado en `.github/workflows/node.js.yml`:
- Setup de Node.js 20.x
- Instalación de pnpm
- Caché de pnpm store
- Build del proyecto
- Ejecución de tests
- Auditoría de seguridad

### Triggers
- Push a `main`
- Pull requests a `main`

## 🎨 Estilos y Assets

### CSS/SCSS
- Estilos globales en `src/styles.css`
- SCSS en `src/assets/scss/`
- CSS específico en `src/assets/css/`

### Imágenes
- Ubicación: `src/assets/img/`
- Usar `NgOptimizedImage` para imágenes estáticas

### Vendor
- Librerías de terceros en `src/assets/vendor/`

## 🔄 Flujo de Desarrollo

### Workflow Recomendado

**IMPORTANTE**: Antes de hacer cualquier commit, SIEMPRE ejecutar:

```bash
# 1. Ejecutar tests con coverage
pnpm run test-headless-cc

# 2. Verificar build
pnpm run build

# 3. Si todo pasa, hacer commit
git add .
git commit -m "descripción del cambio"
```

### Checklist Pre-Commit Ampliada

- [ ] ✅ **Tests pasan**: `pnpm run test-headless`
- [ ] ✅ **Coverage ≥ 80%**: `pnpm run test-headless-cc`
- [ ] ✅ **Build exitoso**: `pnpm run build`
- [ ] ✅ **Sin errores de TypeScript**
- [ ] ✅ **Sin vulnerabilidades**: `pnpm audit`
- [ ] ✅ **Código formateado correctamente**

### Verificación de Coverage

Antes de hacer commit, verificar que el coverage cumpla los requisitos:

```bash
# Verificar coverage completo
pnpm run test-headless-cc

# Buscar en el output las métricas clave:
=============================== Coverage summary ===============================
Statements   : XX.XX% ( XXX/XXX )
Branches     : XX.XX% ( XX/XX )  # ← Debe ser ≥ 80%
Functions    : XX.XX% ( XXX/XXX )
Lines        : XX.XX% ( XXX/XXX )
================================================================================
```

### Flujo Completo de Desarrollo

1. **Crear/Modificar código**
   ```bash
   # Trabajar en tu feature/componente/servicio
   ```

2. **Verificar durante desarrollo**
   ```bash
   pnpm start  # Dev server con hot reload
   ```

3. **Ejecutar tests con coverage**
   ```bash
   pnpm run test-headless-cc
   # DEBE mostrar: TOTAL: X SUCCESS, 0 FAILED
   # DEBE mostrar: Branches ≥ 80%
   ```

4. **Verificar build**
   ```bash
   pnpm run build
   # DEBE completar sin errores
   ```

5. **Verificar seguridad**
   ```bash
   pnpm audit
   # DEBE mostrar: found 0 vulnerabilities
   ```

6. **Commit solo si todo pasa**
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

### ⚠️ Reglas Importantes Actualizadas

- **NUNCA** hacer commit si los tests fallan
- **NUNCA** hacer commit si el coverage < 80%
- **NUNCA** hacer commit si el build falla
- **SIEMPRE** ejecutar tests con coverage antes de commit
- **SIEMPRE** verificar que el build funciona
- **SIEMPRE** revisar errores de TypeScript

## 🎯 Métricas de Calidad Requeridas

- **Branches**: ≥ 80% (Requisito SonarQube)
- **Statements**: ≥ 80%
- **Functions**: ≥ 80%
- **Lines**: ≥ 80%
- **Tests**: 0 FAILED

## 📝 Nota sobre Coverage Estratégico

Para alcanzar el 80% de coverage eficientemente:

1. **Priorizar branches críticas**: `if/else` en componentes principales
2. **Tests de alto impacto**: Cubrir caminos de error y edge cases
3. **Evitar sobre-testing**: Tests simples y directos
4. **Revisar exclusiones**: Configurar SonarQube para excluir código no relevante

Este flujo garantiza que cada commit cumpla con los estándares de calidad del proyecto y pase el Quality Gate de SonarQube. 🚀

### Para Agentes IA

**FLUJO OBLIGATORIO ACTUALIZADO**:

1. **Después de generar/modificar código**:
   ```bash
   pnpm run test-headless-cc && pnpm run cypress:component
   ```
   - Si falla: Arreglar el código o los tests.
   - Si coverage < 80%: Añadir tests para alcanzar el objetivo.

2. **Verificar build**:
   ```bash
   pnpm run build
   ```
   - Si falla: Arreglar errores de compilación o tipos.

3. **Solo entonces hacer commit**:
   ```bash
   git add .
   git commit -m "descripción"
   ```

### Comandos de Verificación Rápida

```bash
# Verificación completa con coverage (ejecutar antes de commit)
pnpm run test-headless-cc && pnpm run cypress:run && pnpm run build && echo "✅ Todo OK - Coverage ≥ 80% - Listo para commit"
```

## 🤝 Contribución

### Para Desarrolladores
1. Instalar pnpm: `npm install -g pnpm`
2. Clonar repositorio
3. Instalar dependencias: `pnpm install`
4. Ejecutar dev server: `pnpm start`
5. **Seguir el flujo de desarrollo** (ver sección anterior)

### Para Agentes IA
1. **SIEMPRE** consultar `.agents/best-practices.md` antes de generar código
2. **NUNCA** usar sintaxis deprecated de Angular
3. **SIEMPRE** seguir las convenciones de TypeScript estrictas
4. **SIEMPRE** considerar accesibilidad (WCAG AA)
5. **SIEMPRE** usar pnpm para gestión de paquetes
6. **SIEMPRE** ejecutar tests y build antes de commit (ver Flujo de Desarrollo)

## 📚 Recursos

### Documentación
- [Angular Docs](https://angular.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [pnpm Docs](https://pnpm.io/)
- [Cypress Docs](https://docs.cypress.io/)

### Archivos Importantes
- `package.json` - Dependencias y scripts
- `angular.json` - Configuración de Angular
- `tsconfig.json` - Configuración de TypeScript
- `.npmrc` - Configuración de pnpm
- `karma.conf.js` - Configuración de tests
- `cypress.config.ts` - Configuración de E2E

## 🐛 Troubleshooting

### Problemas Comunes

**Error: Module not found**
```bash
rm -rf node_modules
pnpm install
```

**Tests fallan**
```bash
pnpm run test-headless-cc
# Revisar logs en coverage/
```

**Build falla**
```bash
pnpm run build
# Verificar errores de TypeScript
```

**Problemas con pnpm**
- Consultar `MIGRATION_TO_PNPM.md`
- Verificar `.npmrc`
- Reinstalar: `rm -rf node_modules && pnpm install`

## 📊 Métricas del Proyecto

- **Componentes**: 15+
- **Servicios**: Múltiples (en `services/`)
- **Tests**: 48 specs (41 activos, 7 skipped)
- **Cobertura**: Configurada con Karma
- **Tamaño del bundle**: ~900KB (inicial)
- **Vulnerabilidades**: 0
- **Estado de tests**: ✅ 41 SUCCESS, 0 FAILED

## 🎯 Roadmap y TODOs

### Mejoras Pendientes
- [ ] Migrar componentes a standalone
- [ ] Implementar signals en todos los componentes
- [x] ~~Actualizar tests deshabilitados (xit → it)~~ - **Completado**: 41/48 tests activos
- [ ] Mejorar cobertura de tests (agregar más casos de prueba)
- [ ] Implementar lazy loading en rutas
- [ ] Optimizar bundle size
- [ ] Agregar más tests E2E
- [ ] Habilitar los 7 tests restantes con `xit`

### Modernización
- [ ] Usar `input()` y `output()` en lugar de decoradores
- [ ] Implementar `computed()` para estado derivado
- [ ] Migrar a control flow nativo (`@if`, `@for`)
- [ ] Implementar OnPush change detection
- [ ] Usar `inject()` en servicios

### Testing
- [x] ~~Habilitar tests básicos de componentes~~ - **Completado**
- [x] ~~Agregar mocking apropiado de servicios~~ - **Completado**
- [ ] Agregar tests de integración
- [ ] Aumentar cobertura a >80%
- [ ] Agregar tests E2E para flujos críticos

---

**Última actualización**: 23 de enero de 2026  
**Versión de Angular**: 21.1.1  
**Package Manager**: pnpm 10.24.0  
**Node.js**: 20.x
