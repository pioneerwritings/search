
describe('Donate Page', () => {
  beforeEach(() => cy.visit('/donate'))

  it('Should render the heading', () => {
    cy.get('h1').should('contain', 'We appreciate your support.')
  })

  it('Should show currency input when "other" is clicked', () => {
    const continueButton = cy.get('.continue')

    continueButton.should('be.disabled')
    cy.get('.other').click()
    cy.get('input[type=number]').should('be.visible')
    cy.get('input[type=number]').type('100')

    continueButton.should('be.enabled')
  })
})

export {}