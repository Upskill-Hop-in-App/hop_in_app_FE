/* -------------------------------------------------------------------------- */
/* -------------------------------- REGISTER -------------------------------- */
/* -------------------------------------------------------------------------- */
Cypress.Commands.add('register', (email, name, username, contact, password) => {
  cy.intercept('POST', '/api/auth/register/client').as('registerRequest')

  cy.visit('/register')

  cy.getByDataCy('input-email').type(email)
  cy.getByDataCy('input-name').type(name)
  cy.getByDataCy('input-username').type(username)
  cy.getByDataCy('input-contact').type(contact)
  cy.getByDataCy('input-password').type(password)
  cy.getByDataCy('input-password-confirmation').type(password)
  cy.highlight('submit-btn')
  cy.getByDataCy('submit-btn').click()

  cy.wait('@registerRequest').then((interception) => {
    expect(interception.response?.statusCode).to.eq(201)
  })
  cy.demoWait(5000)
})

/* -------------------------------------------------------------------------- */
/* ----------------------------- LOGIN & LOGOUT ----------------------------- */
/* -------------------------------------------------------------------------- */
Cypress.Commands.add('login', (email, password) => {
  cy.intercept('POST', '/api/auth/login').as('loginRequest')

  cy.visit('/login')

  cy.getByDataCy('input-email').type(email)
  cy.getByDataCy('input-password').type(password)
  cy.getByDataCy('submit-btn').click()
  cy.get('.toast-message').should('be.visible')

  cy.wait('@loginRequest').then((interception) => {
    expect(interception.response?.statusCode).to.eq(200)
    cy.window().its('localStorage.userToken').should('exist')
  })
  cy.demoWait(5000)
})

Cypress.Commands.add('logout', () => {
  cy.intercept('POST', '/api/auth/logout').as('logoutRequest')

  cy.getByDataCy('logout-btn').click()
  cy.wait('@logoutRequest').then((interception) => {
    expect(interception.response?.statusCode).to.eq(200)
    cy.window().its('localStorage.userToken').should('not.exist')
  })
})

/* -------------------------------------------------------------------------- */
/* --------------------------------- DATA CY -------------------------------- */
/* -------------------------------------------------------------------------- */
Cypress.Commands.add('getByDataCy', (selector, ...args) => {
  cy.demoWait()
  return cy.get(`[data-cy=${selector}]`, ...args)
})

/* -------------------------------------------------------------------------- */
/* ------------------------------ DEMO FEATURES ----------------------------- */
/* -------------------------------------------------------------------------- */
Cypress.Commands.add('demoWait', (time = 500) => {
  cy.wait(time)
})

// Highlight elements
Cypress.Commands.add('highlight', (selector) => {
  cy.getByDataCy(selector).then(($el) => {
    // Add a temporary highlight effect (e.g., border)
    $el.css({
      border: '3px solid red', // Set a red border to show the clicked element
      transition: 'border 0.3s ease-in-out', // Make it smoothly appear
    })

    // Remove the highlight after a short delay
    setTimeout(() => {
      $el.css('border', '') // Remove the border after 300ms
    }, 2000)
    cy.demoWait()
  })
})
