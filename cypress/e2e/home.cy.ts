
describe('Home page', () => {
  beforeEach(() => cy.visit('/'))
  
  it('Should render topics carousel', () => {
    cy.get('.topics-carousel').should('be.visible')
  })

  it('Should render grid', () => {
    cy.get('.grid').children().should('have.length.greaterThan', 10)
  })
})

export {}