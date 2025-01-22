export enum UserRoles {
  admin = 'admin',
  client = 'client',
}
export interface User {
  email: string;
  username: string;
  name: string;
  contact: string;
  role: UserRoles;
  driverRating: number;
  passengerRating: number;
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
