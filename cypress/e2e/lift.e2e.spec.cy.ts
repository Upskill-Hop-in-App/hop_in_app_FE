import { getRandomNumber } from '../support/utils'
import {
  UserLogin,
  UserRegister,
  UserRoles,
} from '../../src/app/models/user.model'
describe('Register and Login', () => {
  const randomNumber = getRandomNumber()
  const adminTest: UserRegister = {
    email: `tobias-${randomNumber}@test.com`,
    name: 'Tobias',
    username: `tobias_${randomNumber}`,
    contact: '999999999',
    password: `psw@${randomNumber}`,
    role: UserRoles.admin,
  }

  const clientTest: UserRegister = {
    email: `tobias-${randomNumber}@test.com`,
    name: 'Tobias',
    username: `tobias_${randomNumber}`,
    contact: '999999999',
    password: `psw@${randomNumber}`,
    role: UserRoles.client,
  }

  before(() => {
    cy.viewport(
      Cypress.config('viewportWidth'),
      Cypress.config('viewportHeight')
    )
    cy.window().then((win) => {
      win.resizeTo(screen.width, screen.height)
    })
  })

  it('Should create a lift', () => {
    cy.login(`admin1@test.com`, `admin123`)
    //Create Lift
    cy.getByDataCy('menu-navbar-btn').click()
    cy.getByDataCy('menu-navbar-myLifts').click()
    cy.getByDataCy('my-lifts-create-btn').click()
    cy.getByDataCy('start-district-dropdown').select('Porto')
    cy.getByDataCy('start-municipality-dropdown').select('Maia')
    cy.getByDataCy('start-parish-dropdown').select('Cidade da Maia')
    cy.getByDataCy('end-district-dropdown').select('Porto')
    cy.getByDataCy('end-municipality-dropdown').select('Maia')
    cy.getByDataCy('end-parish-dropdown').select('Folgosa')
    cy.getByDataCy('car-select').select('22-23-BB')
    cy.getByDataCy('schedule-select').type('2025-01-31T12:30')
    cy.getByDataCy('price-input').type('20')
    cy.getByDataCy('seats-input').type('3')
    cy.getByDataCy('create-lift-btn').click()
    //Lift Created

    //Accept one application from the first lift (if needs change -> see-apps data-cy needs to be altered as well as go-to-lift) populated from the carpool:populate
    cy.getByDataCy('see-apps').click()
    cy.getByDataCy('accept-client1_name-pending').click()

    //Start lift
    cy.getByDataCy('go-to-lift-btn').click()
    cy.getByDataCy('mark-ready-btn').click({ multiple: true })
    cy.getByDataCy('start-lift-btn').click()
    cy.getByDataCy('finish-lift-btn').click()
    cy.getByDataCy('rate-passengers-btn').click()
    cy.getByDataCy('rate-value-passenger').each(($input) => {
      cy.wrap($input).type('4')
    })
    cy.getByDataCy('submit-passenger-ratings-btn').click()
    cy.getByDataCy('menu-navbar-btn').click()
    cy.getByDataCy('logout-btn').click()
    cy.getByDataCy('menu-navbar-btn').click()
    cy.login(`client1@test.com`, `client123`)
    cy.getByDataCy('menu-navbar-btn').click()
    cy.getByDataCy('menu-navbar-myApps').click()
    cy.getByDataCy('go-to-lift-ready').click()
    cy.getByDataCy('rate-driver-btn').click()
    cy.getByDataCy('rate-value-driver').type('4')
    cy.getByDataCy('submit-driver-rating-btn').click()
    cy.getByDataCy('menu-navbar-btn').click()
    cy.getByDataCy('logout-btn').click()
    cy.getByDataCy('menu-navbar-btn').click()
    cy.login(`client2@test.com`, `client123`)
    cy.getByDataCy('menu-navbar-btn').click()
    cy.getByDataCy('menu-navbar-myApps').click()
    cy.getByDataCy('go-to-lift-ready').click()
    cy.getByDataCy('rate-driver-btn').click()
    cy.getByDataCy('rate-value-driver').type('4')
    cy.getByDataCy('submit-driver-rating-btn').click()
    cy.getByDataCy('menu-navbar-btn').click()
    cy.getByDataCy('logout-btn').click()
    cy.getByDataCy('menu-navbar-btn').click()
    cy.login(`admin1@test.com`, `admin123`)
    cy.getByDataCy('menu-navbar-btn').click()
    cy.getByDataCy('menu-navbar-myLifts').click()
    cy.getByDataCy('go-to-lift-btn').click()
    cy.getByDataCy('close-lift-btn').click()
    cy.getByDataCy('navigate-home-btn').click()
  })
})
