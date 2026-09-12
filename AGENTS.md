# AGENTS.md - TFG_UNIR-angular (Angular 21 frontend)

This is one of several implementations of the same TFG app. Siblings live in the parent dir
(`../TFG_UNIR-backend`, `-react`, `-vue3`, `-monorepo`); cross-project conventions are in
`../AGENTS.md`. Root-level docs live here (`DOCS_INDEX.md` indexes them; plans in `docs/plans/`).

## Stack & tooling (verified 2026-09-12)

- Angular **21.2.23** + TypeScript 5.9.3; Karma/Jasmine (181 unit tests) + Cypress for E2E.
- **pnpm only, never npm.** CI runs pnpm 10 / Node 22.x.
- ESLint 9 flat config (`eslint.config.js`, angular-eslint 21). No Prettier is installed.
- SonarCloud gate: coverage ≥ 80%, branches ≥ 80%. Current: 96.98% lines / 100% branches
  (181 tests, measured 2026-09-12).

## Commands

```bash
pnpm start                 # dev server on http://localhost:4200
pnpm run build             # prod build; also the de-facto typecheck (AOT + strictTemplates)
npx tsc -p tsconfig.app.json --noEmit   # typecheck only, faster
pnpm test                  # Karma in watch mode
pnpm run test-headless     # run once in ChromeHeadless
pnpm run test-headless-cc  # + coverage -> coverage/frontend-angular/
pnpm run test-headless --include="**/auth.service.spec.ts"   # single spec file
pnpm run lint              # src/**/*.ts + src/**/*.html only (warnings allowed)
pnpm run verify            # test-headless && build && audit  (same as ./verify.sh)
pnpm security              # multi-tool audit: scripts/security-check.sh
pnpm run cypress:run       # E2E — requires `pnpm start` already serving :4200
pnpm run cypress:open      # Cypress UI (e2e baseUrl = http://localhost:4200)
```

There is no `typecheck`/`format` script; `pnpm run build` is the gate.

## Architecture notes (not obvious from filenames)

- `src/main.ts` bootstraps with `bootstrapApplication(AppComponent, { provideRouter(routes), provideHttpClient(withInterceptorsFromDi()) })`.
  **`src/app/app.module.ts` is dead code** — nothing imports `AppModule`. Do not add
  declarations/imports there; only the exported `routes` array in `app-routing.module.ts` is live.
- Routes are all eager (no lazy loading). `AutenticacionGuard` protects `mis-datos` and `mis-cursos`.
- Backend URL is hardcoded: `API_URL = 'http://localhost:8080/api'` in `src/app/utils/constants.ts`.
  There is **no `src/environments/` and no dev-server proxy**; the Spring Boot backend must run on
  :8080 for real data. Change that constant (or add a proxy) to retarget it.
- Auth: JWT kept in `localStorage` under keys `token`, `usuario`, `isLoggedIn` (see `constants.ts`,
  `AuthService`). Services use `HttpClient` + RxJS; user-facing errors go through SweetAlert2
  (`sweetalert2` is listed in `allowedCommonJsDependencies` in `angular.json`).
- Imports are written as `src/app/...` (tsconfig has `baseUrl: ./` and **no path aliases**).
- Coverage excludes `src/app/model/**` and `src/app/utils/constants.ts` by design
  (`angular.json` `codeCoverageExclude` + `sonar-project.properties` + `.nycrc.json`). Do not add
  new exclusions to reach the 80% gate.

## Code style: legacy vs new

Existing code does **not** follow modern Angular: explicit `standalone: true`, constructor
injection, `*ngIf`/`*ngFor`, no signals, some `@Input()`/`@Output()`, mixed 2- and 4-space
indentation. Don't reformat unrelated files (no formatter is enforced).

New code must: omit `standalone`, use `input()`/`output()`/`computed()`/`inject()`,
`ChangeDetectionStrategy.OnPush`, native control flow (`@if`/`@for`/`@switch`), `host` object
instead of `@HostBinding`/`@HostListener`, class/style bindings instead of `ngClass`/`ngStyle`.
Full rules: `.agents/best-practices.md`. Accessibility (WCAG AA / AXE) is required.

## Gotchas

- **Cypress component testing is broken** with the Angular 21 application builder. The CI
  `component-tests` job swallows its failure (`|| exit 0`) and the coverage job only merges Karma
  output. Prefer E2E (`cypress/e2e/spec.cy.ts`), which mocks `localhost:8080` via `cy.intercept`
  (no backend needed) — but the dev server must be running first.
- **Local env (pnpm 12) breaks `build` and `lint`**: `TS2688: Cannot find type definition file for
  'node'` and `Cannot find package '@eslint/js'`. `tsconfig.app.json` (`types: ["node"]`) and
  `eslint.config.js` reference packages that are only transitive deps; the repo relies on
  `shamefully-hoist` (.npmrc) exposing them in `node_modules/`. CI (pnpm 10) is green. Fix locally
  with `pnpm add -D @types/node @eslint/js typescript-eslint`, or run the project with pnpm 10.
- pnpm 12 warns that `pnpm.overrides` / `pnpm.onlyBuiltDependencies` in `package.json` are ignored;
  pnpm 10 (CI) still honours them. Never delete those security overrides. Under pnpm 12 every
  `pnpm run <script>` re-resolves and rewrites `pnpm-lock.yaml` + adds migrated settings to
  `pnpm-workspace.yaml` — `git checkout` both before committing unless the migration is intended.
  (It also prints a "supply-chain policy" warning block that can look fatal; the script still runs.)
- Dependency bumps: never hand-edit versions in `package.json`. Use
  `pnpm up '<pkg>@^x.y.z'` so `pnpm-lock.yaml` stays in sync. `pnpm up --latest '<pkg>@spec'`
  errors — use `--latest` without specs.
- CI: `pnpm audit --prod` is a hard gate (0 vulnerabilities); dev-only findings are warnings with an
  accepted-list in `.github/workflows/security.yml` (`pnpm audit` is currently clean, 0 vulns).
  Third-party actions must be pinned to 40-char SHAs; secrets are not allowed in `if:` conditions.
- No git hooks are installed (`.husky-example/` is only a template) — run `pnpm run verify` manually.
- Docs lag the manifests: `README.md` still says Angular 21.2.19 and `CONTRIBUTING.md` says Node
  20.x. Trust `package.json` / `pnpm-lock.yaml` and `.github/workflows/` (Node 22.x, pnpm 10).

## Pre-commit checklist

- [ ] `pnpm run test-headless` — 0 failures
- [ ] `pnpm run test-headless-cc` — branches ≥ 80%
- [ ] `pnpm run build` — succeeds
- [ ] `pnpm run lint` — no new errors (warnings allowed)
- [ ] `pnpm audit --prod` — 0 vulnerabilities
- [ ] Docs updated if versions, scripts or rules changed

## Skills

Project skills in `.agents/skills/` — load the matching one before the task:
`angular-component` (new components, signals, host bindings), `angular-testing` (unit tests,
TestBed, mocks), `angular-architect` (routing/state/RxJS/architecture), `wcag` (accessibility).
Supplementary: `.agents/best-practices.md` (full style rules).

## Branch policy (MUST)

- **NEVER commit or push directly to `main` or `master`.** Everything goes through a branch + PR
  (squash merge). Prefixes: `feature/`, `fix/`, `docs/`, `ci/`, `chore/`, `security/`, `release/`.
- **NEVER force-push to `main` or `master`.** Releases use a `release/X.Y.Z` branch, merged via PR,
  then the tag is created from the updated `main`.
- Commits use Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:` …).
- This applies to AI agents too.

## Plan mode & execution records (MUST)

- In **plan mode**, state it explicitly in every response and do NOT change anything until the user
  approves with `adelante` and the system switches to build mode.
- Non-trivial plans go to `docs/plans/YYYY-MM-DD-brief-description.md` including: date, tool/model,
  objectives, file changes, verification steps, design decisions, and status
  (planned / in progress / done).
- Confirm explicit approval before executing a plan; afterwards record the outcome and update status.
