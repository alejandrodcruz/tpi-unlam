
describe('template spec', () => {
  it('passes', () => {
    cy.visit('/');
    cy.compareSnapshot("home");
  })
})
