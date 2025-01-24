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
    cy.wait(500)
  })

  it('Should create my car', () => {
    cy.login(`admin1@test.com`, `admin123`)
    cy.getByDataCy('menu-navbar-btn').click()
    cy.getByDataCy('navbar-managecars-btn').click()
    cy.getByDataCy('managecars-add-car').click()
    cy.getByDataCy('addform-input-brand').type('byd')
    cy.getByDataCy('addform-input-model').type('e3')
    cy.getByDataCy('addform-input-startyear').type('2021')
    cy.getByDataCy('addform-input-endyear').type('2022')
    cy.getByDataCy('addform-input-confirmation').type('byd')
    cy.getByDataCy('addform-submit-btn').click()
  })

  it('Should edit a car', () => {
    cy.login(`admin1@test.com`, `admin123`)
    cy.getByDataCy('menu-navbar-btn').click()
    cy.getByDataCy('navbar-managecars-btn').click()
    cy.getByDataCy('managecars-add-car').click()
    cy.getByDataCy('addform-input-brand').type('byd')
    cy.getByDataCy('addform-input-model').type('e9')
    cy.getByDataCy('addform-input-startyear').type('2021')
    cy.getByDataCy('addform-input-endyear').type('2022')
    cy.getByDataCy('addform-input-confirmation').type('byd')
    cy.getByDataCy('addform-submit-btn').click()
    cy.getByDataCy('mycars-edit-car-byd-e9').click({ force: true })
    // cy.getByDataCy('editform-input-color').clear()
    // cy.getByDataCy('editform-input-color').type('White')
    // cy.getByDataCy('editform-input-plate').clear()
    // cy.getByDataCy('editform-input-plate').type('41-41-DB')
    // cy.getByDataCy('editform-submit-btn').click()
  })

  // it('Should delete a car', () => {
  //   cy.getByDataCy('mycars-add-car').click()
  //   cy.getByDataCy('addform-select-brand').select('renault')
  //   cy.getByDataCy('addform-select-model').select('twingo')
  //   cy.getByDataCy('addform-select-year').select('1993')
  //   cy.getByDataCy('addform-input-color').type('Blue')
  //   cy.getByDataCy('addform-input-plate').type('42-42-DA')
  //   cy.getByDataCy('addform-submit-btn').click()
  //   cy.getByDataCy('mycars-delete-car-42-42-DA').click({ force: true })
  //   cy.getByDataCy('deleteform-input-confirm').type('42-42-DA')
  //   cy.getByDataCy('deleteform-submit-btn').click()
  // })
})
