
describe('Contact Page', () => {
  beforeEach(() => cy.visit('/contact'))

  it('Should render', () => {
    cy.get('h1').should('contain', 'Well Hello There.')
  })

  it('Should throw errors', () => {
    cy.get(`.submit`).click()
    cy.get('.required').should('be.visible')
  })

  it('Should submit successfully', () => {
    cy.get('input[name="first name"]').type('Joel')
    cy.get('input[name="last name"]').type('Rivera')
    cy.get('input[name="email"]').type('joelrivera.me@gmail.com')
    cy.get('textarea[name="message"]').type('This is a test from cypress')
    cy.get('.submit').click()
    cy.get('h1').should('contain', 'Success!')
  })
})

export {}