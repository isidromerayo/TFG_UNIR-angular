import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      // Always setup code coverage task
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- @cypress/code-coverage/task es CJS y debe cargarse con require en el config Node de Cypress
      require('@cypress/code-coverage/task')(on, config)
      return config
    }
  },
})