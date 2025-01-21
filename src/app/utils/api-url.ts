export const BASE_URL_CARPOOL = 'http://localhost:3000/api/';
export const BASE_URL_CARS = 'http://localhost:3001/api/';

export enum ApiUrl {
  register = BASE_URL_CARPOOL + 'auth/register',
  login = BASE_URL_CARPOOL + 'auth/login',
}
