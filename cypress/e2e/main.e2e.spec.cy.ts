import { getRandomNumber } from '../support/utils'
import {
  UserLogin,
  UserRegister,
  UserRoles,
} from './../../src/app/models/user.model'
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

  it('Should register a client', () => {
    cy.register(
      clientTest.email,
      clientTest.name,
      clientTest.username,
      clientTest.contact,
      clientTest.password
    )
  })

  it('Should login as a client', () => {
    cy.login(`tobias-${randomNumber}@test.com`, `psw@${randomNumber}`)
  })

  it('Should create a lift and manage a lift', () => {
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
    cy.getByDataCy('menu-navbar-btn').click()
    cy.getByDataCy('logout-btn').click()
})

it('Should apply to a lift', () => {
    cy.login(`client4@test.com`, `client123`)
    //Find Lift and apply
    cy.getByDataCy('menu-navbar-need-lift').click()
    cy.getByDataCy('filter-end-point-parish').type('Priscos')
    cy.getByDataCy('filter-start-point-municipality').type('Maia')
    cy.getByDataCy('filter-search-btn').click()
    cy.getByDataCy('apply-client1_name').click()
    cy.getByDataCy('confirm-apply').click()

    //Find Application and cancel
    cy.getByDataCy('my-applications-navbar-btn').click()
    cy.getByDataCy('cancel-priscos').click()
    cy.getByDataCy('confirm-cancel-application-btn').click()

    //Find Lift and apply again
    cy.getByDataCy('menu-navbar-need-lift').click()
    cy.getByDataCy('filter-end-point-parish').type('Priscos')
    cy.getByDataCy('filter-start-point-municipality').type('Porto')
    cy.getByDataCy('filter-search-btn').click()
    cy.getByDataCy('apply-client1_name').click()
    cy.getByDataCy('confirm-apply').click()

    //Logout
    cy.getByDataCy('menu-navbar-btn').click()
    cy.getByDataCy('logout-btn').click()

    //Login
    cy.login(`client1@test.com`, `client123`)

    //Accept application
    cy.getByDataCy('my-lifts-navbar-btn').click()
    cy.getByDataCy('see-apps').click()
    cy.getByDataCy('accept-client4_name-pending').click()
  })

})
