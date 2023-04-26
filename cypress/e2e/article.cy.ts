describe('Article Page', () => {
  beforeEach(() => cy.visit('/article/573'))

  it('Should render the heading', () => {
    cy.get('h1').should('contain', 'Justification by Faith')
  })

  it('Should render the article body', () => {
    cy.get('.body').should('be.visible')
  })

  it('Should render the author', () => {
    cy.get('address').should('be.visible')
  })

  it('Should render the periodical', () => {
    cy.get('.periodical').should('be.visible')
  })
})

export {}
