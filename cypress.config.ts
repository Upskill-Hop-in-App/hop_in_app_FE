import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  defaultBrowser: 'chrome',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1920,
    viewportHeight: 1080,
    testIsolation: false,
    defaultCommandTimeout: 10000, // Slows down command execution
    animationDistanceThreshold: 5, // Adjusts animations
    video: true, // Enables video recording
    experimentalStudio: true,
  },
})
