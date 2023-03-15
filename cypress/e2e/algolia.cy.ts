
describe('Algolia search', () => {
  beforeEach(() =>  cy.visit('/'))

  it('Should open search modal', () => {
    cy.get('button[aria-label="Search"]').click()
    cy.get('.search-modal').should('be.visible')
  })

  it('Should complete a search query', () => {
    cy.get('button[aria-label="Search"]').click()
    cy.get('input[type="search"]').type('the Son of God')
    cy.get('form').submit()
    cy.get('output').children().should('have.length.greaterThan', 1)
  })

  it('Should submit query when search button clicked', () => {
    cy.get('button[aria-label="Search"]').click()
    cy.get('input[type="search"]').type('the Son of God')
    cy.get('input[type="search"]').should('contain.value', 'the Son of God')
    cy.get('.ais-SearchBox-submit').click()
    cy.get('output').children().should('have.length.greaterThan', 1)
  })

  it('Should clear the search query', () => {
    cy.get('button[aria-label="Search"]').click()
    cy.get('input[type="search"]').type('the Son of God')
    cy.get('input[type="search"]').should('contain.value', 'the Son of God')
    cy.get('.ais-SearchBox-reset').click()
    cy.get('input[type="search"]').should('contain.value', '')
  })

  it('Should close the search modal', () => {
    cy.get('button[aria-label="Search"]').click()
    cy.get('.search-modal').should('be.visible')
    cy.get(`button[aria-label='Click to close the search modal']`).click()
    cy.get('.search-modal').should('not.be.visible')
  })

  it('Should close the search modal when backdrop clicked', () => {
    cy.get('button[aria-label="Search"]').click()
    cy.get('.search-modal').should('be.visible')
    cy.get('.search-backdrop').click()
    cy.get('.search-modal').should('not.be.visible')
  })
})

export {}