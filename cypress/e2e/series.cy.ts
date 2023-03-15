
describe('Series Page', () => {
  beforeEach(() => cy.visit('/series'))
  
  it('Should render', () => {
    cy.get('h1').should('contain', 'Stay Focused With Series.')
  })

  it('Should render grid', () => {
    cy.get('.grid').children().should('have.length.greaterThan', 10)
  })
})

export {}