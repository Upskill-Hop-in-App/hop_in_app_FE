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

  it('Should create my car', () => {
    cy.login(`admin1@test.com`, `admin123`)
    cy.getByDataCy('navbar-mycars-btn').click()
    cy.getByDataCy('mycars-add-car').click()
    cy.getByDataCy('addform-select-brand').select('acura')
    cy.getByDataCy('addform-select-model').select('cl')
    cy.getByDataCy('addform-select-year').select('1999')
    cy.getByDataCy('addform-input-color').type('Blue')
    cy.getByDataCy('addform-input-plate').type('40-40-DA')
    cy.getByDataCy('addform-submit-btn').click()
  })

  it('Should edit a car', () => {
    cy.getByDataCy('mycars-edit-car').click()
    // cy.getByDataCy('addform-select-brand').select('acura')
    // cy.getByDataCy('addform-select-model').select('cl')
    // cy.getByDataCy('addform-select-year').select('1999')
    // cy.getByDataCy('addform-input-color').type('Blue')
    // cy.getByDataCy('addform-input-plate').type('40-40-DA')
    // cy.getByDataCy('addform-submit-btn').click()
  })
})
