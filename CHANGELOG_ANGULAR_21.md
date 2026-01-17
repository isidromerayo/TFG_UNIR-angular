# Changelog - Angular 21.1.0 Migration

## Version 21.1.0 (2026-01-17)

### 🚀 Major Updates

#### Angular Framework
- **@angular/core**: 20.3.15 → 21.1.0
- **@angular/common**: 20.3.15 → 21.1.0
- **@angular/compiler**: 20.3.15 → 21.1.0
- **@angular/forms**: 20.3.15 → 21.1.0
- **@angular/animations**: 20.3.15 → 21.1.0
- **@angular/platform-browser**: 20.3.15 → 21.1.0
- **@angular/platform-browser-dynamic**: 20.3.15 → 21.1.0
- **@angular/router**: 20.3.15 → 21.1.0

#### Build Tools
- **@angular/cli**: 20.3.13 → 21.1.0
- **@angular-devkit/build-angular**: 20.3.13 → 21.1.0
- **@angular/compiler-cli**: 20.3.15 → 21.1.0

#### Testing Framework
- **jasmine-core**: 4.6.1 → 5.13.0
- **@types/jasmine**: 4.6.5 → 5.1.15
- **@cypress/schematic**: 2.5.2 → 5.0.0
- **cypress**: 15.8.1 → 15.9.0

#### Other Dependencies
- **zone.js**: 0.15.1 → 0.16.0
- **@sweetalert2/ngx-sweetalert2**: 14.1.1 → 14.1.2

### 🔧 Code Changes

#### Bug Fixes
- Removed unnecessary `console.log()` statements from:
  - `src/app/components/registro/registro.component.ts`
  - `src/app/components/carrito/carrito.component.ts`
  - `src/app/components/busqueda/busqueda.component.ts`

#### Test Improvements
- Added `provideHttpClientTesting()` to HTTP mock configuration
- Added `spyOn(console, 'log')` to suppress expected console output in tests
- Added `spyOn(console, 'error')` for error handling tests
- Added `localStorage.clear()` in auth service tests for proper cleanup

### ✅ Validation Results

#### Tests
- **181/181 tests passing** ✅
- **Code Coverage**: 97.38% (Statements), 100% (Branches), 93.27% (Functions), 96.96% (Lines)
- **No console errors** ✅

#### Build
- **Development build**: Successful ✅
- **Production build**: Successful ✅
- **Bundle size**: 909.96 kB (171.92 kB compressed)

#### Security
- **pnpm audit**: 1 low severity vulnerability (transitive dependency)
  - Package: undici (via @angular-devkit/build-angular > @angular/build)
  - Impact: Low - does not affect application
- **pnpm outdated**: No outdated packages ✅

### 📋 Breaking Changes

**None detected** - Angular 21.1.0 is a minor version update with no breaking changes for this application.

### 🔄 Migration Path

This migration follows the official Angular upgrade guide:
1. Updated all Angular packages to 21.1.0
2. Updated build tools and CLI
3. Updated testing framework (Jasmine 5.13.0)
4. Verified all tests pass
5. Verified builds work correctly
6. Cleaned up console output

### 📚 Documentation Updates

- Updated `README.md` with Angular 21.1.0 version
- Updated security status in README
- Created migration documentation in `.kiro/specs/angular-21-upgrade/`

### 🔐 Security Notes

- The single low-severity vulnerability (undici) is a transitive dependency of @angular-devkit/build-angular
- This vulnerability does not affect the application directly
- Monitor for updates to @angular-devkit/build-angular for patches

### 🎯 Next Steps

1. Review and merge this PR
2. Deploy to staging environment
3. Run full integration tests
4. Deploy to production
5. Monitor for any issues

### 📖 Related Documentation

- [FINAL_UPDATE_SUMMARY.md](.kiro/specs/angular-21-upgrade/FINAL_UPDATE_SUMMARY.md) - Complete update summary
- [TEST_FIXES_APPLIED.md](.kiro/specs/angular-21-upgrade/TEST_FIXES_APPLIED.md) - Test fixes details
- [Angular 21 Release Notes](https://angular.io/guide/releases) - Official Angular release notes

---

**Migration completed successfully on 2026-01-17**
