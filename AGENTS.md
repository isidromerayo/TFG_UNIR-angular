# AGENTS.md - Project Context for AI Agents

## Project Overview
- **Framework**: Angular 21.2.7
- **Language**: TypeScript 5.9.3
- **Package Manager**: pnpm (NOT npm)
- **Testing**: Karma/Jasmine (unit) + Cypress E2E

## Agent Skills

Use these skills for specific tasks:

| Skill | When to Use |
|-------|-------------|
| `angular-component` | Creating new components, refactoring to signals, adding host bindings |
| `angular-testing` | Writing unit tests, testing signal-based components, mocking deps |
| `angular-architect` | Architecture decisions, NgRx state, routing patterns, RxJS patterns |
| `wcag` | WCAG 2.2 accessibility guidelines, ARIA, color contrast, keyboard navigation |

**Skill files location:** `.agents/skills/` (project-level)

**How to use skills:**
```
# Read the skill file directly
read .agents/skills/angular-component/SKILL.md
read .agents/skills/angular-testing/SKILL.md
read .agents/skills/angular-architect/SKILL.md
read .agents/skills/wcag/SKILL.md
```

## Build, Test & Development Commands

```bash
# Development
pnpm start              # Dev server at localhost:4200
pnpm run build          # Production build
pnpm run watch          # Watch mode for development

# Testing (Karma/Jasmine)
pnpm test               # Run tests in watch mode
pnpm run test-headless  # Run tests once (headless Chrome)
pnpm run test-headless-cc  # Run tests with code coverage

# Run a SINGLE test file
pnpm test --include="**/some.component.spec.ts"

# E2E Testing (Cypress)
pnpm run cypress:open   # Open Cypress UI
pnpm run cypress:run     # Run Cypress tests headless

# Security & Verification
pnpm audit              # Check vulnerabilities
pnpm run verify         # test-headless + build + audit
```

## Pre-Commit Checklist (MUST PASS)
- [ ] Tests pass: `pnpm run test-headless`
- [ ] Coverage ≥ 80%: `pnpm run test-headless-cc` (Branches ≥ 80%)
- [ ] Build succeeds: `pnpm run build`
- [ ] No TypeScript errors
- [ ] No vulnerabilities: `pnpm audit`

---

# Code Style Guidelines

## TypeScript
- **Strict type checking** is enabled
- Avoid `any`; use `unknown` when type is uncertain
- Prefer type inference when obvious
- Use proper error handling with try/catch
- Enable `strict: true` in tsconfig

## Imports
- Use absolute paths for app modules (e.g., `app/services/auth.service`)
- Group imports in this order: external Angular, external libs, app modules
- Use named imports: `import { Component } from '@angular/core'`
- Avoid barrel files (index.ts) unless necessary

## Formatting
- Use 2 spaces for indentation
- Maximum line length: 100 characters
- Use single quotes for strings
- Trailing commas in multiline arrays/objects
- Use semicolons at statement end

## Angular Components
- **DO NOT** set `standalone: true` (default in Angular 20+)
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Keep components small and focused (single responsibility)
- Prefer inline templates for small components (< 50 lines)

## State Management (Signals)
- Use signals for local component state
- Use `computed()` for derived values
- **NEVER** use `mutate()` - use `update()` or `set()`
- Keep state transformations pure and predictable

## Templates
- Use native control flow: `@if`, `@for`, `@switch`
- **NEVER** use `*ngIf`, `*ngFor`, `*ngSwitch`
- **NEVER** use `ngClass` (use class bindings instead)
- **NEVER** use `ngStyle` (use style bindings instead)
- **NEVER** write arrow functions in templates
- Use async pipe for observables
- Keep templates simple; avoid complex logic

## Services
- Use `inject()` instead of constructor injection
- Use `providedIn: 'root'` for singleton services
- Keep services focused on single responsibility

## Naming Conventions
- Components: `kebab-case` for files, `PascalCase` for classes
- Services: `*.service.ts`
- Models: `*.model.ts` or `*.interface.ts`
- Directives/Pipes: `*.directive.ts`, `*.pipe.ts`
- Use descriptive, meaningful names (avoid abbreviations)

## Accessibility (REQUIRED)
- Must pass all AXE checks
- Must meet WCAG AA (focus management, color contrast, ARIA)

## General
- Use `NgOptimizedImage` for static images
- Prefer Reactive forms over Template-driven forms
- No globals like `new Date()` - inject or pass as input
- Do NOT use `@HostBinding`/`@HostListener` decorators; use `host` object in decorator

---

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
- No ESLint/TSLint configured; use Angular CLI for type checking