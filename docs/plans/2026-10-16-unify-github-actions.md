# Unify GitHub Actions workflows across the frontends (angular as baseline)

- **Date**: 2026-10-16
- **Tool/model**: opencode — DeepSeek V4.1 Flash (medium)
- **Status**: done (branch `ci/unify-github-actions`, PR open)

## Objectives

Angular is the canonical baseline for the frontends' GitHub Actions: a hard
`pnpm audit --prod` production gate and a SonarQube job in `tests.yml` guarded with
`if: env.SONAR_TOKEN != ''`. This change brings the action versions up to date (identical SHAs
across the three frontends) and records the unification. The workflow structure of this repo
already matched the baseline, so no structural change was needed here.

## File changes

- `.github/workflows/node.js.yml`, `tests.yml`, `security.yml`, `codeql.yml`: pin actions to the
  shared current versions (SHA + `# vX.Y.Z`): setup-node v7.1.0, upload-artifact v7.0.2,
  download-artifact v8.0.2, codeql-action v4.38.3, osv-scanner v2.7.0, lcov-reporter-action
  v0.4.0, sonarqube-scan-action v8.3.0, snyk/actions/node.
- `.github/workflows/security.yml` (review follow-up): the production gate distinguishes a
  failed/unparseable `pnpm audit` run (own `::error`, no `vulnerabilities` output, stderr kept
  visible) from actual production advisories, so the issue/PR-comment steps are not triggered by
  infrastructure failures.

## Design decisions

- Angular is the baseline; react and vue3 were aligned to it in their own PRs.
- The action bumps match the Dependabot `actions-minors` group and the `snyk/actions/node`
  bump, so those Dependabot PRs are superseded and closed.
- On audit failure (empty or unparseable report) the gate emits its own `::error` and does not
  set the `vulnerabilities` output: the "create issue" and "comment on PR" steps only fire on a
  real advisory count, never on infra errors.

## Verification

- `actionlint` 1.7.12 over all workflows: no errors.
- `yaml.safe_load` over every workflow: valid.
- No floating action tags remain.
- Gate logic simulated against real `pnpm audit` output: clean report → pass; braces-only
  advisories → pass with warning; braces + another module → fail; empty/unparseable report →
  dedicated audit-failure error.
- Expected CI: all workflows green.
- Replaces Dependabot PRs `#275` (actions-minors) and `#272` (snyk/actions/node).
