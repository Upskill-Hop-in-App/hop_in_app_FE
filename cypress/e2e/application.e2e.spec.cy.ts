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

it.skip('Should apply to a lift', () => {
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
