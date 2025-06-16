describe('AddHotel - Validación de campo ciudad con números', () => {
    Cypress.on('uncaught:exception', () => false);
    let baseUrl;
    const testHotelName = 'Hotel Cypress Test Add Hotel with City with Numbers';

    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl');
    
        if (!baseUrl) {
            baseUrl = 'http://localhost:4200/';
        }

        cy.visit(baseUrl);
        cy.wait(500);
    });

  it('debería mostrar un toast de error cuando la ciudad contiene números', () => {
    cy.wait(1000);
    cy.contains('Add New Hotel').click();
    // Completa campos válidos
    cy.get('input[name="name"]').type('Hotel Cypress');
    cy.get('input[name="price"]').type('150');
    cy.get('input[name="rooms"]').type('3');
    
    // Campo ciudad inválido con números
    cy.get('input[name="city"]').type('C1udad123');

    // Enviar formulario
    cy.get('button[type="submit"]').click();

    // Esperar y verificar el toast
    cy.get('.toast-message')
      .should('contain', 'El nombre de ciudad no puede contener números.')
      .and('be.visible');
  });
});
