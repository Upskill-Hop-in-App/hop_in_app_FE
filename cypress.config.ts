import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  defaultBrowser: "chrome",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    testIsolation: false,
  },
});
