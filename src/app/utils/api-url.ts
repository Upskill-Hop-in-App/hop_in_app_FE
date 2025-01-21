export const BASE_URL_CARPOOL = 'http://localhost:3000/api/';
export const BASE_URL_CARS = 'http://localhost:3001/api/';

export enum ApiUrl {
  registerAdmin = BASE_URL_CARPOOL + 'auth/register/admin',
  registerClient = BASE_URL_CARPOOL + 'auth/register/client',
  login = BASE_URL_CARPOOL + 'auth/login',
}
