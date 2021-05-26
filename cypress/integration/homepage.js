describe('Homepage: Screenshots', function() {
  beforeEach(function() {
    cy.visit('/');
  });

  it('Loads the page', function() {
    cy.get('.template-index').should('have.length', '1');
  });

  it('Captures Screenshots', function() {
    cy.viewport('iphone-5');
    cy.screenshot();
    cy.viewport(620, 1000);
    cy.screenshot();
    cy.viewport(768, 1024);
    cy.screenshot();
    cy.viewport(1025, 768);
    cy.screenshot();
    cy.viewport('macbook-11');
    cy.screenshot();
    cy.viewport('macbook-15');
    cy.screenshot();
  });
});
