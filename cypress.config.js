const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  e2e: {
    baseUrl: 'https://trello.com/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});
