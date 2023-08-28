describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.get('h2').contains('Encuentra tu curso')

  })
})
