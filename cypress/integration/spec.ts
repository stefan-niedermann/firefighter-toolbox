describe('Fax-Generator main screen', () => {

  const sampleText = "Lorem Ipsum dolor sit amet.";

  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the headline', () => {
    cy.contains("Fax-Generator");
  });

  it('should toggle the sections when clicking on them', () => {
    cy.get('[data-test="mitteiler-input"]').should('not.be.visible');
    cy.get('[data-test="mitteiler-panel"]').click();
    cy.get('[data-test="mitteiler-input"]').should('be.visible');
    cy.get('[data-test="mitteiler-panel"]').click();
    cy.get('[data-test="mitteiler-input"]').should('not.be.visible');
  });

  it('should display entered information on the page', () => {
    cy.contains(sampleText).should('not.exist');
    cy.get('[data-test="mitteiler-panel"]').click();
    cy.get('[data-test="mitteiler-input"]').type(sampleText);
    cy.contains(sampleText).should('exist');
  });

  it('should update the URL after changing the input data', () => {
    cy.url().should('not.include', sampleText);
    cy.get('[data-test="mitteiler-panel"]').click();
    cy.get('[data-test="mitteiler-input"]').type(sampleText);
    cy.url().should('include', encodeURIComponent(sampleText));
  });
});