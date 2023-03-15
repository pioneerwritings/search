
describe('Series Detail Page', () => {
  beforeEach(() => cy.visit('/series/18'))
  
  it('Should render the heading', () => {
    cy.get('h1').should('contain', 'Ministration of Angels')
  })

  it('Should render the author', () => {
    cy.get('.author').should('be.visible')
    cy.get('.author').should('contain', 'By D.M. Canright')
  })

  it('Should render the subheading', () => {
    cy.get('.description').should('be.visible')
  })

  it('Should render grid', () => {
    cy.get('.grid').children().should('have.length', 16)
  })
})

export {}