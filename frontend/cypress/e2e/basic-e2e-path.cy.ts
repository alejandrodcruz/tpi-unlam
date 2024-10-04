
describe('Basic e2e path', () => {
  it('1 - Landing page', () => {
    cy.visit('/');
    cy.compareSnapshot("11-landing-page");
  })

  it('2 - Register page', () => {
    cy.visit('/register');
    cy.compareSnapshot("21-register-page");
  })

  it('3 - Log in page and home', () => {
    cy.visit('/login');
    cy.compareSnapshot("31-log-in-page");

    cy.get('input[name="email"]').type('test');
    cy.get('input[name="password"]').type('123');
    cy.compareSnapshot("32-log-in-page-write-credentials");

    cy.get('form').submit();
    cy.compareSnapshot("33-log-in-page-submit-credentials");

    // cy.url().should('include', '/home');
    cy.visit('/home');
    cy.compareSnapshot("34-home-page");
  });

  it('4 - Log-out function', () => {
    cy.visit('/home');
    cy.compareSnapshot("41-before-click-desloguearse");
    cy.contains('Desloguearse').click();

    cy.url().should('include', '/');
    cy.compareSnapshot("42-after-click-desloguearse");
  })

})
