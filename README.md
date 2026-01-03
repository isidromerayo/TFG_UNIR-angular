# FrontendAngular

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=coverage)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=bugs)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=isidromerayo_TFG_UNIR-angular&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=isidromerayo_TFG_UNIR-angular)

**Current version: Angular 20.3.15**

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

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our development workflow and how to submit pull requests.

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
