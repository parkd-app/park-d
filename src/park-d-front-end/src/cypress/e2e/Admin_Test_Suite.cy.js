describe('Admin Test Suite', () => {
  beforeEach (() => {
    cy.visit('index.html')
    cy.get('#email').click().focused().type('test@test.com');
    cy.get('#password').click().focused().type('test1234');
    cy.get('#submit').click();
  });

  afterEach (() => {
    cy.get('body').then(body => {
      if (body.find('#btnLogout[style="display: block;"]').length === 1) {
        cy.get('#btnLogout').click();
      }
    });
  });

  it('Proper sidebar', () => {
    cy.get('#header').should('exist');
    cy.get('#map').should('exist');
    cy.get('button[class="navbar-icon"]').click()
    cy.url().should('include', '/HomeView')
    cy.get('#header').should('exist');
    cy.get('#home').should('exist');
    cy.get('#edit').should('exist');
    cy.get('#contact').should('exist');
    cy.get('#about').should('exist');
    cy.get('#btnLogout').should('be.visible');
    cy.get('#admin').should('not.exist');
  });

  it('Navigate - Home', () => {
    cy.get('#header').should('exist');
    cy.get('button[class="navbar-icon"]').click();
    cy.url().should('include', '/HomeView')
    cy.get('#header').should('exist');
    cy.get('#home').click();
    cy.url().should('include', '/HomeView')
    cy.get('#header').should('exist');
    cy.get('#map').should('exist');
    cy.get('#header').should('exist');
    cy.get('#home').should('exist');
    cy.get('#edit').should('exist');
    cy.get('#contact').should('exist');
    cy.get('#about').should('exist');
    cy.get('#btnLogout').should('be.visible');
    cy.get('#admin').should('not.exist');
  });

  it('Navigate - Edit', () => {
    cy.get('#header').should('exist');
    cy.get('button[class="navbar-icon"]').click();
    cy.url().should('include', '/HomeView')
    cy.get('#header').should('exist');
    cy.get('#edit').click();
    cy.url().should('include', '/Annotate')
  });
})



