import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      // Always setup code coverage task
      require('@cypress/code-coverage/task')(on, config)
      return config
    }
  },

  component: {
    // Component testing disabled for Angular due to TypeScript compilation conflicts
    // Angular CLI 20.x + Cypress 15.x have issues with webpack configuration
    // E2E testing remains fully functional
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: 'cypress/support/component-index.html',
    devServer: {
      framework: 'angular',
      bundler: 'webpack'
    },
    setupNodeEvents(on, config) {
      // Always setup code coverage task
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
    env: {
      // Pass coverage flag to tests
      coverage: process.env['CYPRESS_COVERAGE'] === 'true'
    }
  },
})