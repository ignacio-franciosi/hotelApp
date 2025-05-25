describe('validacion: ciudad no contenga numeros', () => {
    it('Mensaje de error cuando ciudad tiene numeros', () =>{
        const apiUrl = Cypress.env('baseUrl');

        if(!apiUrl){
            throw new Error ('apiUrl is not defined, check env variables');
        }

        cy.visit(apiUrl);

        cy.get('button.btn-primary').contains('Add new hotel').click();
        cy.get('input[name="name"]').type('Hotel A');
        cy.get('input[name="price"]').clear().type('5');
        cy.get('input[name="rooms"]').type('5');
        cy.get('input[name="city"]').type('London123');
        cy.get('.btn').click();
        cy.get('.toast-message').should('contain.text', 'El nombre de ciudad no puede contener números.');

    


    });
});