# 📚 Índice de Documentación del Proyecto

## 📖 Documentación Principal

### 🏠 [README.md](README.md) (2.3KB)
**Para**: Todos los usuarios  
**Contenido**: Introducción al proyecto, comandos básicos, instalación de pnpm

### 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) (4.5KB)
**Para**: Contribuidores y desarrolladores  
**Contenido**: Guía de contribución, flujo de trabajo, checklist pre-commit, guías de estilo

### 🤖 [AGENTS.md](AGENTS.md) (11KB)
**Para**: Agentes IA y desarrolladores  
**Contenido**: Contexto completo del proyecto, arquitectura, flujo de desarrollo, mejores prácticas

### ⚙️ [.agents/best-practices.md](.agents/best-practices.md) (2.3KB)
**Para**: Agentes IA y desarrolladores  
**Contenido**: Mejores prácticas de TypeScript, Angular 20+, accesibilidad, patrones de código

## 📦 Documentación de Migración a pnpm

### 📘 [MIGRATION_TO_PNPM.md](MIGRATION_TO_PNPM.md) (4.1KB)
**Para**: Desarrolladores y DevOps  
**Contenido**: Guía completa de migración de npm a pnpm, configuración, troubleshooting

### 📋 [CHANGELOG_PNPM.md](CHANGELOG_PNPM.md) (2.2KB)
**Para**: Todo el equipo  
**Contenido**: Resumen de cambios realizados en la migración, beneficios obtenidos

### 📊 [RESUMEN_MIGRACION_PNPM.md](RESUMEN_MIGRACION_PNPM.md) (4.5KB)
**Para**: Project leads y managers  
**Contenido**: Resumen ejecutivo de la migración, métricas, verificaciones

### ✅ [CHECKLIST_EQUIPO.md](CHECKLIST_EQUIPO.md) (4.0KB)
**Para**: Todo el equipo de desarrollo  
**Contenido**: Checklist paso a paso para migrar, problemas comunes, timeline

### 🔧 [migrate-to-pnpm.sh](migrate-to-pnpm.sh) (1.6KB)
**Para**: Desarrolladores  
**Contenido**: Script automatizado para realizar la migración

## 🗂️ Organización por Audiencia

### Para Nuevos Desarrolladores
1. Leer [README.md](README.md)
2. Leer [CONTRIBUTING.md](CONTRIBUTING.md) - **IMPORTANTE**
3. Leer [AGENTS.md](AGENTS.md) - Sección "Arquitectura del Proyecto"
4. Revisar [.agents/best-practices.md](.agents/best-practices.md)
5. Seguir [CHECKLIST_EQUIPO.md](CHECKLIST_EQUIPO.md) para setup

### Para Agentes IA
1. **SIEMPRE** leer [.agents/best-practices.md](.agents/best-practices.md)
2. Consultar [AGENTS.md](AGENTS.md) para contexto del proyecto
3. Seguir las guías de "Puntos Clave para Agentes IA"

### Para DevOps/CI/CD
1. Revisar [MIGRATION_TO_PNPM.md](MIGRATION_TO_PNPM.md) - Sección CI/CD
2. Consultar [AGENTS.md](AGENTS.md) - Sección "CI/CD"
3. Verificar `.github/workflows/node.js.yml`

### Para Project Managers
1. Leer [RESUMEN_MIGRACION_PNPM.md](RESUMEN_MIGRACION_PNPM.md)
2. Revisar [CHANGELOG_PNPM.md](CHANGELOG_PNPM.md)
3. Consultar [AGENTS.md](AGENTS.md) - Sección "Roadmap y TODOs"

## 📁 Estructura de Documentación

```
TFG_UNIR-angular/
├── README.md                      # Introducción y comandos básicos
├── AGENTS.md                      # Contexto completo del proyecto
├── DOCS_INDEX.md                  # Este archivo (índice)
│
├── .agents/
│   └── best-practices.md          # Mejores prácticas de código
│
├── Migración pnpm/
│   ├── MIGRATION_TO_PNPM.md       # Guía completa de migración
│   ├── CHANGELOG_PNPM.md          # Changelog de la migración
│   ├── RESUMEN_MIGRACION_PNPM.md  # Resumen ejecutivo
│   ├── CHECKLIST_EQUIPO.md        # Checklist para el equipo
│   └── migrate-to-pnpm.sh         # Script de migración
│
└── Configuración/
    ├── package.json               # Dependencias y scripts
    ├── angular.json               # Config de Angular
    ├── tsconfig.json              # Config de TypeScript
    ├── .npmrc                     # Config de pnpm
    ├── karma.conf.js              # Config de tests
    └── cypress.config.ts          # Config de E2E
```

## 🔍 Búsqueda Rápida

### ¿Cómo instalar el proyecto?
→ [README.md](README.md) - Sección "Installing dependencies"

### ¿Cómo ejecutar tests?
→ [README.md](README.md) - Sección "Running unit tests"  
→ [AGENTS.md](AGENTS.md) - Sección "Testing"

### ¿Qué componentes tiene el proyecto?
→ [AGENTS.md](AGENTS.md) - Sección "Arquitectura del Proyecto"

### ¿Cómo escribir código Angular moderno?
→ [.agents/best-practices.md](.agents/best-practices.md)  
→ [AGENTS.md](AGENTS.md) - Sección "Puntos Clave para Agentes IA"

### ¿Por qué usamos pnpm?
→ [MIGRATION_TO_PNPM.md](MIGRATION_TO_PNPM.md) - Sección "¿Por qué pnpm?"  
→ [CHANGELOG_PNPM.md](CHANGELOG_PNPM.md) - Sección "Beneficios obtenidos"

### ¿Cómo migrar mi entorno local a pnpm?
→ [CHECKLIST_EQUIPO.md](CHECKLIST_EQUIPO.md)  
→ Ejecutar: `./migrate-to-pnpm.sh`

### ¿Qué cambios se hicieron en CI/CD?
→ [MIGRATION_TO_PNPM.md](MIGRATION_TO_PNPM.md) - Sección "CI/CD"  
→ [AGENTS.md](AGENTS.md) - Sección "CI/CD"

### ¿Hay vulnerabilidades de seguridad?
→ [AGENTS.md](AGENTS.md) - Sección "Seguridad"  
→ Ejecutar: `pnpm audit`

## 🎯 Guías Rápidas

### Setup Inicial (5 minutos)
```bash
# 1. Instalar pnpm
npm install -g pnpm

# 2. Clonar e instalar
git clone <repo>
cd TFG_UNIR-angular
pnpm install

# 3. Ejecutar
pnpm start
```

### Desarrollo Diario
```bash
pnpm start              # Dev server
pnpm test               # Tests con watch
pnpm run build          # Build de producción
pnpm audit              # Check de seguridad
```

### Antes de Hacer PR
```bash
pnpm run build          # Verificar build
pnpm run test-headless  # Ejecutar tests
pnpm audit              # Verificar seguridad
```

## 📝 Notas Importantes

### ⚠️ Deprecaciones
- **NO usar** `*ngIf`, `*ngFor`, `*ngSwitch` → Usar `@if`, `@for`, `@switch`
- **NO usar** `ngClass`, `ngStyle` → Usar class/style bindings
- **NO usar** decoradores `@Input()`, `@Output()` → Usar `input()`, `output()`
- **NO usar** `standalone: true` en decoradores → Es el default en Angular 20+

### ✅ Mejores Prácticas
- Usar signals para estado
- Usar `computed()` para valores derivados
- Usar `inject()` en lugar de constructor injection
- Implementar `ChangeDetectionStrategy.OnPush`
- Seguir WCAG AA para accesibilidad

### 🔒 Seguridad
- Proyecto sin vulnerabilidades conocidas
- Dependencias actualizadas a Angular 21.2.7
- Usar `pnpm audit` regularmente
- Skills de proyecto disponibles en `.agents/skills/`

## 🆘 Soporte

### Problemas Técnicos
1. Consultar [AGENTS.md](AGENTS.md) - Sección "Troubleshooting"
2. Consultar [MIGRATION_TO_PNPM.md](MIGRATION_TO_PNPM.md) - Sección "Troubleshooting"
3. Revisar issues en GitHub
4. Contactar al equipo de desarrollo

### Dudas sobre pnpm
1. Leer [MIGRATION_TO_PNPM.md](MIGRATION_TO_PNPM.md)
2. Consultar [pnpm docs](https://pnpm.io/)
3. Ejecutar `./migrate-to-pnpm.sh` para migración automatizada

### Dudas sobre Angular
1. Revisar [.agents/best-practices.md](.agents/best-practices.md)
2. Consultar [Angular docs](https://angular.dev/)
3. Revisar ejemplos en el código existente

---

**Última actualización**: 2 de abril de 2026  
**Mantenido por**: Equipo de desarrollo  
**Versión del proyecto**: 0.2.0
