// Plugins enable you to tap into, modify, or extend the internal behavior of Cypress
// For more info, visit https://on.cypress.io/plugins-api

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const parsePdf = 

module.exports = (on: any, config: any) => {
  on('task', {
    getPdfContent: (pdfName: string) => pdf(fs.readFileSync(path.join('cypress/downloads/', pdfName)))
  })
};
