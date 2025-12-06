# AGENTS.md - Contexto del Proyecto Frontend Angular

## 📋 Información General del Proyecto

### Descripción
Aplicación web frontend desarrollada en Angular para un sistema de gestión de cursos online. Permite a los usuarios navegar, buscar, comprar y gestionar cursos educativos.

### Tecnologías Principales
- **Framework**: Angular 20.3.15
- **Lenguaje**: TypeScript 5.8.3
- **Package Manager**: pnpm 10.24.0
- **Testing**: Karma + Jasmine, Cypress
- **UI/Alerts**: SweetAlert2
- **HTTP Client**: Axios + Angular HttpClient
- **Estilos**: CSS + SCSS

### Versión
- **Versión actual**: 0.1.0
- **Generado con**: Angular CLI 16.0.2
- **Actualizado a**: Angular 20.3.15

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

### Estado Actual
- ✅ 0 vulnerabilidades conocidas
- ✅ Dependencias actualizadas a versiones seguras
- ✅ Angular 20.3.15 (incluye parches de seguridad)

### Auditoría
```bash
pnpm audit  # Verificar vulnerabilidades
```

### Autenticación
- Guard implementado: `autenticacion.guard.ts`
- Protección de rutas privadas
- Gestión de sesiones de usuario

## 🧪 Testing

### Unit Tests (Karma + Jasmine)
- 19 tests activos
- 16 tests deshabilitados (marcados con `xit`)
- Coverage configurado
- Ejecutar: `pnpm run test-headless-cc`

### E2E Tests (Cypress)
- Configurado con `@cypress/schematic`
- Tests interactivos: `pnpm run cypress:open`
- Tests CI/CD: `pnpm run cypress:run`

### Estructura de Tests
```
src/app/
├── app.component.spec.ts
├── autenticacion.guard.spec.ts
└── components/
    ├── acceso/acceso.component.spec.ts
    ├── carrito/carrito.component.spec.ts
    └── [otros componentes]/*.spec.ts
```

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

## 📦 Dependencias Clave

### Producción
- `@angular/*` - Framework Angular 20.3.15
- `@sweetalert2/ngx-sweetalert2` - Alertas y modales
- `axios` - Cliente HTTP alternativo
- `rxjs` - Programación reactiva
- `sweetalert2` - Librería de alertas

### Desarrollo
- `@angular/cli` - CLI de Angular
- `@angular-devkit/build-angular` - Build tools
- `cypress` - E2E testing
- `karma` + `jasmine` - Unit testing
- `typescript` - Lenguaje

## 🔄 Migración Reciente

### De npm a pnpm
El proyecto fue migrado de npm a pnpm. Documentación disponible:
- `MIGRATION_TO_PNPM.md` - Guía completa
- `CHANGELOG_PNPM.md` - Resumen de cambios
- `CHECKLIST_EQUIPO.md` - Checklist para el equipo
- `migrate-to-pnpm.sh` - Script de migración

### Actualización de Angular
- Actualizado de Angular 16.x a 20.3.15
- Resueltas 18 vulnerabilidades de seguridad
- Todas las dependencias sincronizadas

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

## 🤝 Contribución

### Para Desarrolladores
1. Instalar pnpm: `npm install -g pnpm`
2. Clonar repositorio
3. Instalar dependencias: `pnpm install`
4. Ejecutar dev server: `pnpm start`
5. Ejecutar tests: `pnpm test`

### Para Agentes IA
1. **SIEMPRE** consultar `.agents/best-practices.md` antes de generar código
2. **NUNCA** usar sintaxis deprecated de Angular
3. **SIEMPRE** seguir las convenciones de TypeScript estrictas
4. **SIEMPRE** considerar accesibilidad (WCAG AA)
5. **SIEMPRE** usar pnpm para gestión de paquetes

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
- **Tests**: 35 specs (19 activos)
- **Cobertura**: Configurada con Karma
- **Tamaño del bundle**: ~900KB (inicial)
- **Vulnerabilidades**: 0

## 🎯 Roadmap y TODOs

### Mejoras Pendientes
- [ ] Migrar componentes a standalone
- [ ] Implementar signals en todos los componentes
- [ ] Actualizar tests deshabilitados (xit → it)
- [ ] Mejorar cobertura de tests
- [ ] Implementar lazy loading en rutas
- [ ] Optimizar bundle size
- [ ] Agregar más tests E2E

### Modernización
- [ ] Usar `input()` y `output()` en lugar de decoradores
- [ ] Implementar `computed()` para estado derivado
- [ ] Migrar a control flow nativo (`@if`, `@for`)
- [ ] Implementar OnPush change detection
- [ ] Usar `inject()` en servicios

---

**Última actualización**: 6 de diciembre de 2024  
**Versión de Angular**: 20.3.15  
**Package Manager**: pnpm 10.24.0  
**Node.js**: 20.x
