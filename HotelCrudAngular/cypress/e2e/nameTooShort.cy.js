describe('AddHotel - Validación de nombre de hotel demasiado corto', () => {
    Cypress.on('uncaught:exception', () => false);
    let baseUrl;
    const testHotelName = 'Hotel Cypress Test Add Hotel with name too short';

    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl');
    
        if (!baseUrl) {
            baseUrl = 'http://localhost:4200/';
        }

        cy.visit(baseUrl);
        cy.wait(500);
    });

  it('debería mostrar un toast de error cuando el nombre de hotel es demasiado corto', () => {
    cy.wait(1000);
    cy.contains('Add New Hotel').click();
    // Completa campos válidos
    cy.get('input[name="name"]').type('H');
    cy.get('input[name="price"]').type('20'); //precio = 0
    cy.get('input[name="rooms"]').type('20');  
    cy.get('input[name="city"]').type('Ciudad');

    // Enviar formulario
    cy.get('button[type="submit"]').click();

    // Esperar y verificar el toast
    cy.get('.toast-message')
      .should('contain', 'El nombre del hotel debe tener al menos 2 caracteres.')
      .and('be.visible');
  });
});
