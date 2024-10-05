
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
    cy.visit('/dashboard');
    cy.compareSnapshot("34-home-page");
  });

  it('4 - Huella de carbono page', () => {
    cy.visit('/huella');
    cy.compareSnapshot("41-huella-de-carbono-page");
  })

  it('5 - Dashboard historico page', () => {
    cy.visit('/historico');
    cy.compareSnapshot("51-dashboard-historico-page");
  })

  it('6 - Reportes page', () => {
    cy.visit('/reportes');
    cy.compareSnapshot("61-reportes-page");
  })

  it('7 - Configuracion page', () => {
    cy.visit('/configuracion');
    cy.compareSnapshot("71-reportes-page");
  })

  it('9 - Log-out function', () => {
    cy.visit('/dashboard');
    cy.compareSnapshot("91-before-click-desloguearse");
    cy.contains('Desloguearse').click();

    cy.url().should('include', '/');
    cy.compareSnapshot("92-after-click-desloguearse");
  })

})
