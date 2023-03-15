
describe('Article page', () => {
  beforeEach(() => cy.visit('/articles/573'))

  it('Should render', () => {
    cy.get('h1').should('contain', 'Justification by Faith')
  })
})

export {}