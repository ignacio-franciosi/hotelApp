describe('AddHotel - Validación de precio mayor a 0', () => {
    Cypress.on('uncaught:exception', () => false);
    let baseUrl;
    const testHotelName = 'Hotel Cypress Test Add Hotel with price 0';

    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl') || 'http://localhost:4200/';
        cy.visit(baseUrl);
        cy.wait(500);
    });

  it('debería mostrar un toast de error cuando el precio es 0', () => {
    cy.wait(1000);
    cy.contains('Add New Hotel').click();
    // Completa campos válidos
    cy.get('input[name="name"]').type('Hotel Cypress');
    cy.get('input[name="price"]').type('0'); //precio = 0
    cy.get('input[name="rooms"]').type('20');  
    cy.get('input[name="city"]').type('Ciudad');

    // Enviar formulario
    cy.get('button[type="submit"]').click();

    // Esperar y verificar el toast
    cy.get('.toast-message')
      .should('contain', 'El precio del hotel es obligatorio.')
      .and('be.visible');
  });
});
