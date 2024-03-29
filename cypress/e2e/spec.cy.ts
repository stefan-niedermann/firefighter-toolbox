describe('the firefighter toolbox', () => {
  const $ = (attr: string) => cy.get(`[data-test="${attr}"]`)
  const sampleText = 'Lorem Ipsum.'

  describe('the request for refund', () => {
    beforeEach(() => {
      cy.visit('/erstattung')
    })

    it('should contain the entered information', () => {
      $('allgemeines-panel').click()
      $('wehr-input').type(sampleText)
      $('download-button').trigger('click')
      cy.wait(4_000);
      cy.task('getPdfContent', 'Antrag auf Erstattung.pdf')
        .then(content => expect((content as any).text).to.contain(sampleText))
    })
  })

  describe('the exercise operation fax generator', () => {
    const downloadedFilename = () => `Übungs-Fax ${new Date().toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' })}.pdf`

    beforeEach(() => {
      cy.visit('/fax')
    })

    it('should display the headline', () => {
      cy.contains("Übungsfax Generator")
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

    xdescribe('the downloadable PDF version', () => {
      it('should always contain a hint that this is an exercise fax', () => {
        cy.wait(1_000)
        $('download-button').click()
        cy.wait(4_000);
        cy.task('getPdfContent', downloadedFilename())
          .then(content => expect((content as any).text).to.contain('ÜBUNGS-FAX'))
      })

      it('should pass the entered text to the downloadable PDF', () => {
        $('mitteiler-panel').click()
        $('mitteiler-input').type(sampleText)
        cy.wait(1_000)
        $('download-button').click()
        cy.wait(4_000);
        cy.task('getPdfContent', downloadedFilename())
          .then(content => expect((content as any).text).to.contain(sampleText))
      })
    })
  })
})