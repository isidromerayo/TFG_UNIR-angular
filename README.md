# FrontendAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.2.

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

## Security

To check for vulnerabilities, run:
```bash
pnpm audit
```

All dependencies are currently up to date with no known vulnerabilities.

### Why pnpm?

- **Security**: Strict dependency resolution prevents phantom dependencies
- **Performance**: Faster installation and better caching
- **Disk Space**: Content-addressable storage saves disk space
- **Monorepo Support**: Better support for monorepo structures

## Migration to pnpm

This project has been migrated from npm to pnpm. For detailed migration information, see:
- `MIGRATION_TO_PNPM.md` - Complete migration guide
- `CHANGELOG_PNPM.md` - Summary of changes
- `migrate-to-pnpm.sh` - Automated migration script

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
