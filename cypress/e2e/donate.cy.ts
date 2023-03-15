
describe('Donate Page', () => {
  beforeEach(() => cy.visit('/donate'))

  it('Should render', () => {
    cy.get('h1').should('contain', 'We appreciate your support.')
  })
})

export {}