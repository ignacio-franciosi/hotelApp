describe('| Tests - Delete Hotel |', () => {
    Cypress.on('uncaught:exception', () => false);

    let baseUrl;
    let apiUrl;
    const testHotelName = 'Hotel Cypress Test Delete';

    before(() => {
        apiUrl = Cypress.env('apiUrl') || 'http://localhost:7150';

        cy.request({
            method: 'POST',
            url: `${apiUrl}/api/hotel/create`,
            body: {
                name: testHotelName,
                price: 100,
                rooms: 5,
                city: 'TestCity'
            },
            failOnStatusCode: false
        }).then((response) => {
            if (response.status === 400 && response.body.includes('ya está registrado')) {
                cy.log('Hotel ya existe, continuando...');
            } else {
                expect(response.status).to.eq(200);
            }
        });

        cy.wait(3000); // Esperamos a que el backend persista el hotel y se refleje en el frontend
    });

    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl') || 'http://localhost:4200/';
        cy.visit(baseUrl);
        cy.wait(3000); // Esperamos a que el frontend cargue completamente
    });

    it('Debería eliminar un hotel al hacer clic en el icono de eliminar', () => {
        cy.wait(3000); // Aseguramos que la tabla esté visible

        cy.contains('td', testHotelName, { timeout: 10000 }).should('exist');

        cy.wait(2000); // Esperamos antes de intentar hacer clic

        cy.contains('td', testHotelName)
            .parent()
            .within(() => {
                cy.get('td').last().find('span.icon-btn').click();
            });

        cy.wait(3000); // Esperamos a que el backend procese la eliminación

        cy.reload();
        cy.wait(3000); // Esperamos a que se recargue la tabla y se refleje la eliminación

        cy.contains('td', testHotelName).should('not.exist');
    });
});
