describe('| Tests - Delete Hotel |', () => {
    Cypress.on('uncaught:exception', () => false);

    let baseUrl;
    let apiUrl;
    const testHotelName = 'Hotel Cypress Test Delete';

    before(() => {
        apiUrl = Cypress.env('apiUrl') || 'http://localhost:7150';

        // Intentar crear el hotel, pero ignorar el error si ya existe
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
                cy.log('Hotel ya existe, continuando con la prueba...');
            } else {
                expect(response.status).to.eq(200); // o 201, según tu API
            }
        });
    });

    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl') || 'http://localhost:4200/';
        cy.visit(baseUrl);
        cy.wait(500);
    });

    it('Debería eliminar un hotel al hacer clic en el icono de eliminar', () => {
        cy.wait(1000);

        // Verificar que el hotel exista y eliminarlo
        cy.contains('td', testHotelName)
            .should('exist')
            .parent()
            .within(() => {
                cy.get('td').last().find('span.icon-btn').click();
            });

        // Esperar y recargar
        cy.wait(1000);
        cy.reload();
        cy.wait(1000);

        // Verificar que el hotel ya no esté
        cy.contains('td', testHotelName).should('not.exist');
    });
});
