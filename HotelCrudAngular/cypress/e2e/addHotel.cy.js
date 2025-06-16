describe('| Tests - Add Hotel |', () => {
    Cypress.on('uncaught:exception', () => false);

    let baseUrl;
    const testHotelName = 'Hotel Cypress Test Add';

    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl');
    
        if (!baseUrl) {
            baseUrl = 'http://localhost:4200/';
        }

        cy.visit(baseUrl);
        cy.wait(500);
    });

    it('Debería crear un hotel, verificarlo y luego eliminarlo', () => {
        cy.wait(1000);

        // Contar filas antes
        cy.get('table tr').then((rowsBefore) => {
            const rowCountBefore = rowsBefore.length;

            // Ir al formulario
            cy.contains('Add New Hotel').click();

            // Llenar formulario
            cy.get('input[name="name"]').type(testHotelName);
            cy.get('input[name="price"]').type('200');
            cy.get('input[name="rooms"]').type('15');
            cy.get('input[name="city"]').type('Testopolis');

            // Enviar
            cy.get('button[type="submit"]').click();

            // Volver al home
            cy.visit(baseUrl);
            cy.wait(1000);

            // Verificar que el nuevo hotel esté
            cy.get('table tr').should('have.length.greaterThan', rowCountBefore);
            cy.contains('td', testHotelName).should('exist');

            // Eliminar el hotel desde la tabla (última fila)
            cy.get('table tr').last().within(() => {
                cy.get('td').last().find('span.icon-btn').click();
            });

            // Esperar y verificar que ya no esté
            cy.wait(1000);
            cy.reload();
            cy.wait(1000);
            cy.contains('td', testHotelName).should('not.exist');
        });
    });
});
