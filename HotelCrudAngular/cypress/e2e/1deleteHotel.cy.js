describe('| Tests - Delete Hotel |', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    let baseUrl;
    let apiUrl;

    before(() => {
        // Crear hotel directamente por API (puedes omitir si ya existe en BD)
        apiUrl = Cypress.env('apiUrl');
        if(!apiUrl){
            apiUrl = 'http://localhost:7150'
        }
        cy.request('POST', `${apiUrl}/api/hotel/create`, {
            name: 'Hotel Cypress Test Delete',
            price: 100,
            rooms: 5,
            city: 'TestCity'
        });
    });

    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl');
    
        if (!baseUrl) {
            baseUrl = 'http://localhost:4200/';
        }

        cy.visit(baseUrl);
        cy.wait(500);
    });

    it('Debería eliminar un hotel al hacer clic en el icono de eliminar', () => {
        cy.wait(1000);
        // Contamos cuántos hoteles hay antes
        cy.get('table tr').then((rowsBefore) => {
            const rowCountBefore = rowsBefore.length;

            // Seleccionamos el último ícono de tachito (eliminar)
            cy.get('table tr').last().find('td').last().find('span.icon-btn').click();

            // Esperamos a que el backend procese la eliminación
            cy.wait(1000); 

            // Recargamos la página para reflejar los cambios
            cy.reload();
            cy.wait(1000);

            // Verificamos que ahora haya una fila menos
            cy.get('table tr').should('have.length.lessThan', rowCountBefore);
        });
    });
});