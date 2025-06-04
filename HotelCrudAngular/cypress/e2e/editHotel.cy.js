describe('| Tests - Edit Hotel |', () => {
    Cypress.on('uncaught:exception', () => false);

    let baseUrl;
    const originalName = 'Hotel Nombre original';
    const editedName = 'Hotel nombre editado';
    const originalCity = 'Ciudad original'
    const editedCity = 'Ciudad Editada';

    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl') || 'http://localhost:4200/';
        cy.visit(baseUrl);
        cy.wait(500);
    });

    it('Debería editar un hotel y verificar los cambios', () => {
        // Crear hotel de prueba primero
        cy.contains('Add New Hotel').click();
        cy.get('input[name="name"]').type(originalName);
        cy.get('input[name="price"]').type('123');
        cy.get('input[name="rooms"]').type('10');
        cy.get('input[name="city"]').type(originalCity);
        cy.get('button[type="submit"]').click();

        // Volver al home
        cy.visit(baseUrl);
        cy.wait(1000);

        // Hacer clic en la sexta columna (botón editar) de la última fila
        cy.get('table tr').last().find('td:nth-child(6) span').first().click({ force: true });
        cy.wait(1000);

        // Editar datos
        cy.get('input[name="name"]').clear().type(editedName);
        cy.get('input[name="city"]').clear().type(editedCity);
        cy.get('button[type="submit"]').click();

        // Volver al home
        cy.visit(baseUrl);
        cy.wait(1000);

        // Verificar cambios
        cy.contains('td', editedName).should('exist');
        cy.contains('td', editedCity).should('exist');

        // Eliminar como limpieza
        cy.get('table tr').last().find('td').last().find('span.icon-btn').click();
        cy.wait(500);
        cy.reload();
        cy.wait(1000);
  
    });
});
