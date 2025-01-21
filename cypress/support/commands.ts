Cypress.Commands.add('register', (email, name, username, contact, password) => {
  cy.intercept('POST', '/api/auth/register/client').as('registerRequest');

  cy.visit('/register');

  cy.get('[data-cy=input-email]').type(email);
  cy.get('[data-cy=input-name]').type(name);
  cy.get('[data-cy=input-username]').type(username);
  cy.get('[data-cy=input-contact]').type(contact);
  cy.get('[data-cy=input-password]').type(password);
  cy.get('[data-cy=input-password-confirmation]').type(password);
  cy.get('[data-cy=submit-btn]').click();

  /* --------------------------- Assert status code --------------------------- */
  cy.wait('@registerRequest').then((interception) => {
    expect(interception.response?.statusCode).to.eq(201);
  });
});

Cypress.Commands.add('login', (email, password) => {
  cy.intercept('POST', '/api/auth/login').as('loginRequest');

  cy.visit('/login');

  /* -------------------------- Fill and submit form -------------------------- */
  cy.get('[data-cy=input-email]').type(email);
  cy.get('[data-cy=input-password]').type(password);
  cy.get('[data-cy=submit-btn]').click();
  cy.get('.toast-message').should('be.visible');

  /* ---------------------- Assert status code and token ---------------------- */
  cy.wait('@loginRequest').then((interception) => {
    expect(interception.response?.statusCode).to.eq(200);
    cy.window().its('localStorage.userToken').should('exist');
  });
});
