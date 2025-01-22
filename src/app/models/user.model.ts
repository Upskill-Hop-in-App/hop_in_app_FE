export enum UserRoles {
  admin = 'admin',
  client = 'client',
}

export interface UserRegister {
  email: string;
  username: string;
  name: string;
  password: string;
  contact: string;
  role: UserRoles;
}

export interface UserLogin {
  email: string;
  password: string;
}
export interface User {
  email: string;
  username: string;
  name: string;
  contact: string;
  role?: string;
  driverRating?: number;
  passengerRating?: number;
}

export interface UserUpdate {
  email: string;
  name: string;
  username: string;
  contact: string;
}

export interface UserPassword {
  password: string;
}
