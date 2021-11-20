describe('the exercise operation fax generator', () => {

  const sampleText = "Lorem Ipsum.";

  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the headline', () => {
    cy.contains("Fax-Generator");
  });

  describe('the form', () => {
    it('should toggle the sections when clicking on them', () => {
      cy.get('[data-test="mitteiler-input"]').should('not.be.visible');
      cy.get('[data-test="mitteiler-panel"]').click();
      cy.get('[data-test="mitteiler-input"]').should('be.visible');
      cy.get('[data-test="mitteiler-panel"]').click();
      cy.get('[data-test="mitteiler-input"]').should('not.be.visible');
    });

    it('should update the URL after changing the input data', () => {
      cy.url().should('not.include', sampleText);
      cy.get('[data-test="mitteiler-panel"]').click();
      cy.get('[data-test="mitteiler-input"]').type(sampleText);
      cy.url().should('include', encodeURIComponent(sampleText));
    });
  });

  describe('the live preview', () => {
    it('should always contain a hint that this is an exercise fax', () => {
      cy.contains('ÜBUNGS-FAX');
    });

    it('should display entered information', () => {
      cy.contains(sampleText).should('not.exist');
      cy.get('[data-test="mitteiler-panel"]').click();
      cy.get('[data-test="mitteiler-input"]').type(sampleText);
      cy.contains(sampleText).should('exist');
    });
  });

  describe('the downloadable PDF version', () => {
    it('should always contain a hint that this is an exercise fax', () => {
      cy.wait(1_000);
      cy.get('[data-test="download-button"]').click();
      const date = new Date();
      cy.task('getPdfContent', `Übungs-Fax ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.pdf`).then(content => {
        expect(content.text).to.contain('ÜBUNGS-FAX');
      });
    });

    it('should pass the entered text to the downloadable PDF version', () => {
      cy.get('[data-test="mitteiler-panel"]').click();
      cy.get('[data-test="mitteiler-input"]').type(sampleText);
      cy.wait(1_000);
      cy.get('[data-test="download-button"]').click();
      const date = new Date();
      cy.task('getPdfContent', `Übungs-Fax ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.pdf`).then(content => {
        expect(content.text).to.contain(sampleText);
      });
    });
  });
});