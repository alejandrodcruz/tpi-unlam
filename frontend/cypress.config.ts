import { defineConfig } from 'cypress'
import { configureVisualRegression } from 'cypress-visual-regression'

export default defineConfig({
  e2e: {
    env: {
      //visualRegressionType: 'base',
      visualRegressionType: 'regression',
      visualRegressionBaseDirectory: 'cypress/screenshots/base',
      visualRegressionDiffDirectory: 'cypress/screenshots/diff',
      visualRegressionGenerateDiff: 'always',
      visualRegressionFailSilently: false
    },
    screenshotsFolder: './cypress/screenshots/actual',
    setupNodeEvents(on, config) {
      configureVisualRegression(on)
    },
    baseUrl: 'http://localhost:4200',

  }
})
