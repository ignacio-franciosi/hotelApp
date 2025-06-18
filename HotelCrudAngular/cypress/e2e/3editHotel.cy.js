describe('| Tests - Edit Hotel |', () => {
    Cypress.on('uncaught:exception', () => false);

    let baseUrl;
    const originalName = 'Hotel Nombre original';
    const editedName = 'Hotel nombre editado';
    const originalCity = 'Ciudad original';
    const editedCity = 'Ciudad Editada';

    beforeEach(() => {
        baseUrl = Cypress.env('baseUrl');
    
        if (!baseUrl) {
            baseUrl = 'http://localhost:4200/';
        }

        cy.visit(baseUrl);
        cy.wait(1000); // Aumentado
    });

    it('Debería editar un hotel y verificar los cambios', () => {
        // Crear hotel de prueba primero
        cy.contains('Add New Hotel').click();
        cy.wait(500); // Esperar modal/formulario

        cy.get('input[name="name"]').type(originalName);
        cy.wait(200);
        cy.get('input[name="price"]').type('123');
        cy.wait(200);
        cy.get('input[name="rooms"]').type('10');
        cy.wait(200);
        cy.get('input[name="city"]').type(originalCity);
        cy.wait(200);
        cy.get('button[type="submit"]').click();
        cy.wait(1500); // Esperar creación y redirección

        // Volver al home
        cy.visit(baseUrl);
        cy.wait(1500); // Aumentado

        // Hacer clic en el botón editar (sexta columna de la última fila)
        cy.get('table tr').last().find('td:nth-child(6) span').first().click({ force: true });
        cy.wait(1000); // Aumentado

        // Editar datos
        cy.get('input[name="name"]').clear().type(editedName);
        cy.wait(300);
        cy.get('input[name="city"]').clear().type(editedCity);
        cy.wait(300);
        cy.get('button[type="submit"]').click();
        cy.wait(1500); // Aumentado

        // Volver al home
        cy.visit(baseUrl);
        cy.wait(1500); // Aumentado

        // Verificar cambios
        cy.contains('td', editedName).should('exist');
        cy.contains('td', editedCity).should('exist');

        // Eliminar como limpieza
        cy.get('table tr').last().find('td').last().find('span.icon-btn').click();
        cy.wait(1000); // Aumentado
        cy.reload();
        cy.wait(1500); // Aumentado
    });
});
