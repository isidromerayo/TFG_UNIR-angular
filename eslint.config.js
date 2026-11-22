// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'reports/**',
      'openspec/**',
      'out-tsc/**',
      '.angular/**',
      '.husky-example/**',
      'node_modules/**',
      'src/assets/vendor/**',
      'eslint.config.js',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'prefer-const': 'warn',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      // Reglas de modernización (AGENTS.md "legacy vs new"): el código heredado
      // no se convierte en bloque de una iteración; warn para no romper el gate.
      '@angular-eslint/prefer-inject': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/non-nullable-type-assertion-style': 'warn',
      // Paridad con Codacy (type-aware): el ruido de `any` de los servicios
      // heredados (get<any>) baja a warn; se endurecerá al tipar los DTOs.
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
    },
  },
  {
    // Specs and Cypress use Jasmine spies and untyped fixtures everywhere: the
    // *any* comes from the harness, not from the app design. Keep catching real
    // type errors there, silence the unsafe-* noise.
    files: ['**/*.spec.ts', 'cypress/**/*.ts', 'cypress.config.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      '@angular-eslint/template/no-autofocus': 'warn',
      // Migración pendiente al control flow nativo (@if/@for): warn, no gate.
      '@angular-eslint/template/prefer-control-flow': 'warn',
    },
  },
  {
    files: ['src/main.ts'],
    rules: {
      'no-console': 'off',
    },
  }
);
