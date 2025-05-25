describe('validacion: cantidad de habitaciones menor o igual a 0', () => {
  it('Mensaje de error cuando rooms es 0', () => {
    const apiUrl = Cypress.env('baseUrl');

    if (!apiUrl) {
      throw new Error('apiUrl is not defined, check env variables');
    }

    cy.visit(apiUrl);

    cy.get('button.btn-primary').contains('Add new hotel').click();
    cy.get('input[name="name"]').type('Hotel Test');
    cy.get('input[name="price"]').clear().type('100');
    cy.get('input[name="rooms"]').clear().type('0');
    cy.get('input[name="city"]').type('Ciudad Test');
    cy.get('.btn').click();
    cy.get('.toast-message').should('contain.text', 'El campo rooms es debe ser mayor a 0');
  });
});
