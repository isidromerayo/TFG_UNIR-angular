# AGENTS.md - Project Context for AI Agents

## Project Overview
- **Framework**: Angular 21.2.7
- **Language**: TypeScript 5.9.3
- **Package Manager**: pnpm (NOT npm)
- **Testing**: Karma/Jasmine + Cypress E2E

## Agent Skills

Use these skills for specific tasks:

| Skill | When to Use |
|-------|-------------|
| `angular-component` | Creating new components, refactoring to signals, adding host bindings |
| `angular-testing` | Writing unit tests, testing signal-based components, mocking deps |
| `angular-architect` | Architecture decisions, NgRx state, routing patterns, RxJS patterns |

**Load a skill** when the task matches:
- `angular-component`: Component creation/refactoring
- `angular-testing`: Test creation or fixing
- `angular-architect`: Architecture decisions

**Skill files location:** `.agents/skills/` (project-level, committed to repo)

**How to use skills:**
Due to tool limitations, project-level skills must be loaded manually:
```
# Read the skill file directly
read .agents/skills/angular-component/SKILL.md
read .agents/skills/angular-testing/SKILL.md
read .agents/skills/angular-architect/SKILL.md

# For specific topics, check references:
# - angular-testing/references/testing-patterns.md
# - angular-architect/references/ngrx.md, routing.md, rxjs.md
```

## Build, Test & Development Commands

```bash
# Development
pnpm start              # Dev server at localhost:4200
pnpm run build          # Production build
pnpm run watch          # Watch mode for development

# Testing
pnpm test               # Run tests in watch mode
pnpm run test-headless       # Run tests once (headless Chrome)
pnpm run test-headless-cc    # Run tests with code coverage

# Run a SINGLE test file
pnpm test --include="**/some.component.spec.ts"

# E2E Testing
pnpm run cypress:open   # Open Cypress UI
pnpm run cypress:run    # Run Cypress tests headless

# Security & Verification
pnpm audit              # Check vulnerabilities
pnpm run verify         # test-headless + build + audit

# Pre-commit verification (REQUIRED before commit)
pnpm run test-headless-cc && pnpm run build && pnpm audit
```

## Pre-Commit Checklist (MUST PASS)
- [ ] Tests pass: `pnpm run test-headless`
- [ ] Coverage ≥ 80%: `pnpm run test-headless-cc` (Branches ≥ 80%)
- [ ] Build succeeds: `pnpm run build`
- [ ] No TypeScript errors
- [ ] No vulnerabilities: `pnpm audit`

## Code Style Guidelines

### TypeScript
- Use strict type checking
- Avoid `any`; use `unknown` when type is uncertain
- Prefer type inference when obvious
- Use proper error handling with try/catch

### Angular Components
- **DO NOT** set `standalone: true` (default in Angular 20+)
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Keep components small and focused

### State Management
- Use signals for local state
- Use `computed()` for derived values
- **NEVER** use `mutate()`, use `update()` or `set()`

### Templates
- Use native control flow: `@if`, `@for`, `@switch`
- **NEVER** use `*ngIf`, `*ngFor`, `*ngSwitch`
- **NEVER** use `ngClass` (use class bindings instead)
- **NEVER** use `ngStyle` (use style bindings instead)
- **NEVER** write arrow functions in templates
- Use async pipe for observables

### Services
- Use `inject()` instead of constructor injection
- Use `providedIn: 'root'` for singletons
- Keep services focused on single responsibility

### Accessibility (REQUIRED)
- Must pass all AXE checks
- Must meet WCAG AA (focus management, color contrast, ARIA)

### Naming Conventions
- Components: `kebab-case` for files, `PascalCase` for classes
- Services: `*.service.ts`
- Models: `*.model.ts` or `*.interface.ts`
- Use descriptive names

### General
- Use `NgOptimizedImage` for static images
- Prefer Reactive forms over Template-driven forms
- Keep templates simple; avoid complex logic
- No globals like `new Date()` - inject or pass as input

## Project Structure
```
src/app/
├── components/       # 15+ components (login, cursos, etc.)
├── services/         # API services
├── model/            # TypeScript interfaces
├── utils/            # Helpers
├── app-routing.module.ts
└── app.module.ts
```

## Key Files
- `package.json` - Dependencies and scripts
- `angular.json` - Angular CLI config
- `tsconfig.json` - TypeScript config
- `.npmrc` - pnpm configuration
- `karma.conf.js` - Test configuration
- `.agents/best-practices.md` - Detailed best practices

## Important Notes
- **ALWAYS** use pnpm, never npm
- Run tests with coverage before any commit
- Branches coverage must be ≥ 80% (SonarQube requirement)
- Cypress component testing has limitations with Angular 21; use E2E tests
- Check `.agents/best-practices.md` for detailed guidelines
- Use skills for component creation and testing:
  - `angular-component` skill for creating components
  - `angular-testing` skill for unit testing
  - `angular-architect` skill for architecture decisions

## Documentation Rules

When making changes that affect documentation, you MUST update:

| Change Type | Files to Update |
|-------------|-----------------|
| Angular version update | `README.md`, `DOCS_INDEX.md`, `AGENTS.md`, `package.json` |
| New dependency/skill added | `AGENTS.md` (add to skills section), `DOCS_INDEX.md` |
| CI/CD workflow change | `AGENTS.md` (update commands if needed) |
| Testing framework change | `AGENTS.md`, `README.md`, `karma.conf.js` |

**Update Checklist:**
1. Update version in README.md
2. Update version in AGENTS.md (Project Overview)
3. Update DOCS_INDEX.md (version and date)
4. Update CHANGELOG if exists
5. Verify all referenced files are in sync
