describe('| Tests - Add Hotel |', () => {
    Cypress.on('uncaught:exception', () => false);

    let baseUrl;
    const testHotelName = 'Hotel Cypress Test Add';

    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl') || 'http://localhost:4200/';
        cy.visit(baseUrl);

        // Esperar a que cargue la tabla
        cy.get('table', { timeout: 15000 }).should('be.visible');
        cy.wait(3000); // Para garantizar que la tabla tenga contenido
    });

    it('Debería crear un hotel, verificarlo y luego eliminarlo', () => {
        cy.get('table tr', { timeout: 10000 }).should('have.length.at.least', 1);
        
        cy.get('table tbody tr, table tr:not(:first-child)').then((rowsBefore) => {
            const rowCountBefore = rowsBefore.length;
            cy.log(`Filas antes de crear: ${rowCountBefore}`);

            cy.contains('Add New Hotel', { timeout: 10000 }).should('be.visible').click();
            cy.wait(1000);

            cy.get('input[name="name"]', { timeout: 10000 }).should('be.visible');
            cy.get('input[name="name"]').clear().type(testHotelName);
            cy.get('input[name="price"]').clear().type('200');
            cy.get('input[name="rooms"]').clear().type('15');
            cy.get('input[name="city"]').clear().type('Testopolis');

            cy.get('button[type="submit"]').click();
            cy.wait(3000); // Aumentamos un poco el tiempo tras el submit

            cy.visit(baseUrl);
            cy.wait(5000); // Para esperar redirección y carga completa

            cy.get('table', { timeout: 15000 }).should('be.visible');
            cy.wait(3000);

            cy.get('table tbody tr, table tr:not(:first-child)', { timeout: 15000 })
                .should('have.length.greaterThan', rowCountBefore);

            cy.contains('td', testHotelName, { timeout: 10000 }).should('exist');
            cy.log('Hotel creado exitosamente');

            cy.contains('tr', testHotelName).within(() => {
                cy.get('td').last().find('span.icon-btn, button, .delete-btn').click();
            });

            cy.wait(3000);
            cy.reload();
            cy.get('table', { timeout: 15000 }).should('be.visible');
            cy.wait(3000);

            cy.contains('td', testHotelName).should('not.exist');
            cy.log('Hotel eliminado exitosamente');
        });
    });
});
