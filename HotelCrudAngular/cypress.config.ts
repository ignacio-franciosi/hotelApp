import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    reporter: 'junit',
    reporterOptions: {
      mochaFile: 'cypress/results/results-[hash].xml',
      toConsole: true,
      attachments: true,  // Para incluir screenshots
      testCaseSwitchClassnameAndName: false,
    },
    // Configuraciones adicionales útiles para CI/CD
    video: true,  // Graba videos de los tests
    screenshotOnRunFailure: true,  // Screenshots cuando fallan
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
  },
  experimentalStudio: true,
});