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

  it('Should login as a client', () => {
    cy.login(`admin1@test.com`, `admin123`)
    cy.getByDataCy("menu-navbar-btn").click()
    cy.getByDataCy("menu-navbar-myLifts").click()
    cy.getByDataCy("my-lifts-create-btn").click()
  })
})
