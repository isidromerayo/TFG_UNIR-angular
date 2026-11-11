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
})