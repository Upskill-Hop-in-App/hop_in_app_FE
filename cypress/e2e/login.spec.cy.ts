import {
  UserLogin,
  UserRegister,
  UserRoles,
} from './../../src/app/models/user.model';
describe('Register and Login', () => {
  const min = 100000;
  const max = 999999;

  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  const adminTest: UserRegister = {
    email: `tobias-${randomNumber}@test.com`,
    name: 'Tobias',
    username: `tobias_${randomNumber}`,
    contact: '999999999',
    password: `psw@${randomNumber}`,
    role: UserRoles.admin,
  };

  const clientTest: UserRegister = {
    email: `tobias-${randomNumber}@test.com`,
    name: 'Tobias',
    username: `tobias_${randomNumber}`,
    contact: '999999999',
    password: `psw@${randomNumber}`,
    role: UserRoles.client,
  };

  it('Should register a client', () => {
    cy.register(
      adminTest.email,
      adminTest.name,
      adminTest.username,
      adminTest.contact,
      adminTest.password,
    );
  });
  it('Should login as a client', () => {
    cy.login(`tobias-${randomNumber}@test.com`, `psw@${randomNumber}`);
  });
});
