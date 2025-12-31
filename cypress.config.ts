import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      // Enable code coverage conditionally
      if (process.env.CYPRESS_COVERAGE === 'true') {
        require('@cypress/code-coverage/task')(on, config)
      }
      return config
    }
  },
  
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
    setupNodeEvents(on, config) {
      // Enable code coverage conditionally
      if (process.env.CYPRESS_COVERAGE === 'true') {
        require('@cypress/code-coverage/task')(on, config)
      }
      return config
    },
    env: {
      // Pass coverage flag to tests
      coverage: process.env.CYPRESS_COVERAGE === 'true'
    }
  }
})