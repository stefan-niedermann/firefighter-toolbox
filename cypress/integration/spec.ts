describe('the firefighter toolbox', () => {
  describe('the exercise operation fax generator', () => {

    const $ = (attr: string) => cy.get(`[data-test="${attr}"]`)
    const sampleText = 'Lorem Ipsum.'
    const downloadedFilename = () => `Übungs-Fax ${new Date().toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' })}.pdf`

    beforeEach(() => {
      cy.visit('/fax')
    })

    it('should display the headline', () => {
      cy.contains("Fax-Generator")
    })

    describe('the form', () => {
      it('should toggle the sections when clicking on them', () => {
        $('mitteiler-input').should('not.be.visible')
        $('mitteiler-panel').click()
        $('mitteiler-input').should('be.visible')
        $('mitteiler-panel').click()
        $('mitteiler-input').should('not.be.visible')
      })

      it('should update the URL after changing the input data', () => {
        cy.url().should('not.include', sampleText)
        $('mitteiler-panel').click()
        $('mitteiler-input').type(sampleText)
        cy.url().should('include', encodeURIComponent(sampleText))
      })
    })

    describe('the live preview', () => {
      it('should always contain a hint that this is an exercise fax', () => {
        cy.get('.preview').contains('ÜBUNGS-FAX')
      })

      it('should display entered information', () => {
        cy.get('.preview').contains(sampleText).should('not.exist')
        $('mitteiler-panel').click()
        $('mitteiler-input').type(sampleText)
        cy.get('.preview').contains(sampleText).should('exist')
      })
    })

    describe('the downloadable PDF version', () => {
      it('should always contain a hint that this is an exercise fax', () => {
        cy.wait(1_000)
        $('download-button').click()
        cy.task('getPdfContent', downloadedFilename())
          .then(content => expect((content as any).text).to.contain('ÜBUNGS-FAX'))
      })

      it('should pass the entered text to the downloadable PDF', () => {
        $('mitteiler-panel').click()
        $('mitteiler-input').type(sampleText)
        cy.wait(1_000)
        $('download-button').click()
        cy.task('getPdfContent', downloadedFilename())
          .then(content => expect((content as any).text).to.contain(sampleText))
      })
    })
  })
})