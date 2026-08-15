# TFG UNIR - Angular

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=coverage)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=bugs)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)

# Universidad Internacional de La Rioja

## Escuela Superior de Ingeniería y Tecnología 

### Grado en Ingeniería Informática

#### TFG: Frameworks frontend JavaScript: Análisis y estudio práctico

##### Angular

## 📅 Ciclo de Vida de Angular

**Current version: Angular 21.2.19**

Angular publica una nueva versión mayor cada 6 meses, y cada versión mayor recibe **18 meses de soporte total**, divididos en dos fases:

| Fase | Duración | Qué incluye |
|------|----------|-------------|
| Soporte activo (Active) | 6 meses | Actualizaciones programadas, versiones menores y parches rutinarios |
| Soporte a largo plazo (LTS) | 12 meses | Solo correcciones críticas de bugs y parches de seguridad |

### Estado de Angular 21

| Hito | Fecha |
|------|-------|
| Lanzamiento v21.0.0 | 19 de noviembre de 2025 |
| Fin del soporte activo | 3 de junio de 2026 (cuando se lanzó v22.0.0) |
| Fin del soporte LTS | ~junio de 2027 |
| Último parche disponible | 21.2.19 (29 de julio de 2026) |

### Implicaciones para este proyecto

- **Angular 21 está actualmente en fase LTS**: solo recibe correcciones críticas y parches de seguridad, ya no hay nuevas funcionalidades.
- **Angular 22 es la versión activa** (lanzada el 3 de junio de 2026). La migración a v22 no es urgente desde el punto de vista de soporte, pero es el siguiente paso planificado.
- **Es obligatorio mantener la rama 21.x al día**: los parches de seguridad (como el XSS i18n o el fallo de HttpTransferCache corregidos en 21.2.19) solo se aplican a las versiones dentro de la ventana de soporte.
- **Fuente oficial**: [Angular versioning and releases](https://angular.dev/reference/releases)

## Package Manager

This project uses [pnpm](https://pnpm.io/) as the package manager for better security, performance, and disk space efficiency.

### Installing pnpm

If you don't have pnpm installed, install it globally:

```bash
npm install -g pnpm
```

Or using other methods: https://pnpm.io/installation

### Installing dependencies

```bash
pnpm install
```

## Development server

Run `pnpm start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `pnpm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `pnpm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

For headless testing (CI/CD):
- `pnpm run test-headless` - Run tests once in headless Chrome
- `pnpm run test-headless-cc` - Run tests with code coverage

## Running end-to-end tests

Run `pnpm run cypress:open` to open Cypress test runner, or `pnpm run cypress:run` to execute the end-to-end tests in headless mode.

## 🔒 Security

### Auditoría de Seguridad

```bash
# Auditoría completa multi-herramienta
pnpm security

# Verificar vulnerabilidades (pnpm audit)
pnpm security:audit

# Ver dependencias desactualizadas
pnpm security:outdated
```

⚠️ **Importante**: `pnpm audit` solo consulta la npm Advisory Database. Para una seguridad completa:
- Revisar PRs de Snyk y Dependabot
- Monitorear security advisories de paquetes críticos
- Usar múltiples herramientas de auditoría

**Estado actual**: ✅ 0 vulnerabilidades conocidas

Ver documentación completa:
- [SECURITY_SETUP.md](./SECURITY_SETUP.md) - Configuración de seguridad
- [SECURITY_AUDIT_ANALYSIS.md](./SECURITY_AUDIT_ANALYSIS.md) - Análisis de herramientas
- [DEPENDENCY_UPDATE_GUIDE.md](./DEPENDENCY_UPDATE_GUIDE.md) - Guía de actualización

### Why pnpm?

- **Security**: Strict dependency resolution prevents phantom dependencies
- **Performance**: Faster installation and better caching
- **Disk Space**: Content-addressable storage saves disk space
- **Monorepo Support**: Better support for monorepo structures

## 🚀 CI/CD

### GitHub Actions

El proyecto incluye los siguientes workflows en `.github/workflows/`. Todos usan **Node.js 22.x** (vía `actions/setup-node@v7`) y `pnpm` 10.x, y fijan las actions a commits SHA completos para builds inmutables.

#### Pipeline (node.js.yml)

Se ejecuta en push a `main` y pull requests a `main`:
1. **Checkout** - Descarga el código
2. **Setup Node.js** - Configura Node.js 22.x
3. **Install pnpm** - Instala pnpm 10.x
4. **Cache** - Cachea el store de pnpm
5. **Install** - Instala dependencias con `--frozen-lockfile`
6. **Build** - Compila el proyecto
7. **Test** - Ejecuta tests con coverage
8. **SonarQube** - Análisis de calidad de código (SonarCloud, gate ≥ 80%)

#### Tests (tests.yml)

Ejecuta la suite de pruebas (Unit Tests Karma/Jasmine, Component Tests Cypress, E2E) con fusión de cobertura, en push a `main`/`develop` y PRs.

#### CodeQL (codeql.yml)

Análisis estático de seguridad (`github/codeql-action`) con el análisis `javascript-typescript`, resultados en **Security → Code Scanning**.

#### Security Workflow (security.yml)

Auditoría de seguridad multi-herramienta (diaria 2 AM UTC, push y PRs a `main`):
- pnpm audit, npm audit, outdated check, Snyk (opcional vía `SNYK_TOKEN`) y OSV Scanner (`google/osv-scanner-action/osv-scanner-action@<sha>`, serie v2.5.0)
- Sube reportes como artifacts y crea issues/comentarios automáticos (permisos `issues: write` y `pull-requests: write`)
- Pasos con secretos protegidos con `if: env.X != ''` (los secretos no son válidos en condiciones `if:`)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our development workflow and how to submit pull requests.

**Note:** Direct commits or pushes to `main` are not allowed. All changes must go through a Pull Request.

### Quick Start for Contributors
```bash
pnpm install
pnpm run test-headless  # Verify tests pass
pnpm run build          # Verify build works
```

## Migration to pnpm

This project has been migrated from npm to pnpm. For detailed migration information, see:
- `MIGRATION_TO_PNPM.md` - Complete migration guide
- `CHANGELOG_PNPM.md` - Summary of changes
- `migrate-to-pnpm.sh` - Automated migration script

## Documentation

- [DOCS_INDEX.md](DOCS_INDEX.md) - Complete documentation index
- [AGENTS.md](AGENTS.md) - Project context for AI agents
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
