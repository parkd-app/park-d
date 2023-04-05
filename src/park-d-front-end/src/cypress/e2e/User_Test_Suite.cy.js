describe('User Test Suite', () => {
    beforeEach (() => {
        cy.visit('index.html')
        cy.get('#usermode').click();
    });
  
    it('Proper headings and navbar', () => {
      cy.visit('index.html')
      cy.get('#email').click().focused().type('test@test.com');
      cy.get('#password').click().focused().type('test1234');
      cy.get('#submit').click();
      cy.get('#header').should('exist');
      cy.get('#map').should('exist');
      cy.get('button[class="navbar-icon"]').click()
      cy.get('#header').should('exist');
      cy.get('#home').should('exist');
      cy.get('#edit').should('exist');
      cy.get('#contact').should('exist');
      cy.get('#about').should('exist');
      cy.get('#btnLogout').should('be.visible');
      cy.get('#admin').should('not.exist');
    });
  })  