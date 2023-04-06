describe('Login Test Suite', () => {
  afterEach (() => {
    cy.get('body').then(body => {
      if (body.find('#btnLogout[style="display: block;"]').length === 1) {
        cy.get('#btnLogout').click();
      }
    });
  });

  it('Successful login', () => {
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

  it('Unsuccessful login - Invalid email', () => {
    cy.visit('index.html');
    cy.get('#email').click().focused().type('fake');
    cy.get('#password').click().focused().type('fake');
    cy.get('#submit').click();
    cy.get('#lblLoginErrorMessage').contains('Invalid email. Try again.');
  })

  it('Unsuccessful login - No real user', () => {
    cy.visit('index.html');
    cy.get('#email').click().focused().type('fake@fake.com');
    cy.get('#password').click().focused().type('fake');
    cy.get('#submit').click();
    cy.get('#lblLoginErrorMessage').contains('User does not exist. Try again.');
  });

  it('Unsuccessful login - No real user', () => {
    cy.visit('index.html');
    cy.get('#email').click().focused().type('fake@fake.com');
    cy.get('#password').click().focused().type('fake');
    cy.get('#submit').click();
    cy.get('#lblLoginErrorMessage').contains('User does not exist. Try again.');
  });

  it('Unsuccessful login - No input', () => {
    cy.visit('index.html');
    cy.get('#email').click().focused().type('fake@fake.com');
    cy.get('#submit').click();
    cy.get('#lblLoginErrorMessage').contains('Internal error. Input a correct username and password and try again.');
  });

  it('Unsuccessful login - Wrong Password', () => {
    cy.visit('index.html');
    cy.get('#email').click().focused().type('test@test.com');
    cy.get('#password').click().focused().type('fake');
    cy.get('#submit').click();
    cy.get('#lblLoginErrorMessage').contains('Wrong password. Try again.');
  });

  it('Navigate to User Mode', () => {
    cy.visit('index.html');
    cy.get('#usermode').click();
    cy.get('#header').should('exist');
    cy.get('#map').should('exist');
    cy.get('button[class="navbar-icon"]').click()
    cy.get('#header').should('exist');
    cy.get('#home').should('exist');
    cy.get('#edit').should('not.exist');
    cy.get('#contact').should('exist');
    cy.get('#about').should('exist');
    cy.get('#btnLogout').should('not.be.visible');
    cy.get('#admin').should('exist');
  });
})



