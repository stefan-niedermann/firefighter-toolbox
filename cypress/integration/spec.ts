describe('Fax-Generator main screen', () => {

  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains("Fax-Generator")
  })
})