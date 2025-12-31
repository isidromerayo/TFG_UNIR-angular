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
    // Temporarily disable component testing due to Angular CLI webpack config conflicts
    // This will be re-enabled once the Angular CLI compatibility issue is resolved
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
    setupNodeEvents(on, config) {
      // Disable component testing for now to avoid Angular CLI conflicts
      console.log('Component testing temporarily disabled due to Angular CLI webpack configuration conflicts')
      return config
    }
  }
})