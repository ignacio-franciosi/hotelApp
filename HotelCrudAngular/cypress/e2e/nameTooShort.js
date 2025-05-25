describe('validacion: longitud minima de nombre', () => {
    it('Mensaje de error cuando tiene menos de 2 caracteres', () =>{
        const apiUrl = Cypress.env('baseUrl');

        if(!apiUrl){
            throw new Error ('apiUrl is not defined, check env variables');
        }

        cy.visit(apiUrl);

        cy.get('button.btn-primary').contains('Add new hotel').click();
        cy.get('input[name="name"]').type('H');
        cy.get('input[name="price"]').type('5');
        cy.get('input[name="rooms"]').type('5');
        cy.get('input[name="city"]').type('City A');
        cy.get('.btn').click();
        cy.get('.toast-message').should('contain.text', 'El nombre del hotel debe tener al menos 2 caracteres.');

    


    });
});