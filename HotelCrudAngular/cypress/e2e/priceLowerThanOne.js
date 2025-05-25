describe('validacion: precio menor o igual a 0', () => {
  it('Mensaje de error cuando el precio es 0', () => {
    const apiUrl = Cypress.env('baseUrl');

    if (!apiUrl) {
      throw new Error('apiUrl is not defined, check env variables');
    }

    cy.visit(apiUrl);

    cy.get('button.btn-primary').contains('Add new hotel').click();
    cy.get('input[name="name"]').type('Hotel A');
    cy.get('input[name="price"]').clear().type('0');
    cy.get('input[name="rooms"]').type('5');
    cy.get('input[name="city"]').type('Ciudad Test');
    cy.get('.btn').click();
    cy.get('.toast-message').should('contain.text', 'El precio del hotel debe ser mayor que 0.');
  });
});
