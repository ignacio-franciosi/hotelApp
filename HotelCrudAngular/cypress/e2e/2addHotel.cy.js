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
        // Esperar a que la página esté completamente cargada
        cy.get('table', { timeout: 10000 }).should('be.visible');
        cy.wait(1000);
    });

    it('Debería crear un hotel, verificarlo y luego eliminarlo', () => {
        // Esperar a que la tabla esté completamente cargada
        cy.get('table tr', { timeout: 10000 }).should('have.length.at.least', 1);
        
        // Contar filas antes (excluyendo header si existe)
        cy.get('table tbody tr, table tr:not(:first-child)').then((rowsBefore) => {
            const rowCountBefore = rowsBefore.length;
            
            cy.log(`Filas antes de crear: ${rowCountBefore}`);

            // Ir al formulario
            cy.contains('Add New Hotel', { timeout: 10000 }).should('be.visible').click();

            // Esperar a que el formulario esté visible
            cy.get('input[name="name"]', { timeout: 10000 }).should('be.visible');

            // Llenar formulario
            cy.get('input[name="name"]').clear().type(testHotelName);
            cy.get('input[name="price"]').clear().type('200');
            cy.get('input[name="rooms"]').clear().type('15');
            cy.get('input[name="city"]').clear().type('Testopolis');

            // Enviar formulario y esperar respuesta
            cy.get('button[type="submit"]').click();

            // Esperar a que aparezca algún indicador de éxito o redirección
            cy.wait(2000);

            // Volver al home
            cy.visit(baseUrl);
            cy.wait(3000);
            
            // Esperar a que la página se recargue completamente
            cy.get('table', { timeout: 15000 }).should('be.visible');
            cy.wait(5000);

            // Verificar que el nuevo hotel esté en la tabla
            // Usar un timeout más largo para Azure
            cy.get('table tbody tr, table tr:not(:first-child)', { timeout: 15000 })
                .should('have.length.greaterThan', rowCountBefore);
            
            // Verificar que el hotel específico existe
            cy.contains('td', testHotelName, { timeout: 10000 }).should('exist');

            cy.log('Hotel creado exitosamente');

            // Eliminar el hotel - buscar la fila que contiene el hotel
            cy.contains('tr', testHotelName).within(() => {
                cy.get('td').last().find('span.icon-btn, button, .delete-btn').click();
            });

            // Esperar confirmación de eliminación
            cy.wait(3000);
            
            // Recargar página para verificar eliminación
            cy.reload();
            cy.get('table', { timeout: 10000 }).should('be.visible');
            cy.wait(2000);
            
            // Verificar que el hotel ya no existe
            cy.contains('td', testHotelName).should('not.exist');
            
            cy.log('Hotel eliminado exitosamente');
        });
    });
});
