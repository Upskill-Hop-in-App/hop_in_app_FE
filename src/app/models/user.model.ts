export interface User {
  email: string;
  username: string;
  name: string;
  contact: string;
  role?: string;
  driverRating?: number;
  passengerRating?: number;
}

export interface UserRegister {
  email: string;
  username: string;
  name: string;
  password: string;
  contact: string;
  role: string;
}

export interface UserLogin {
  email: string;
  password: string;
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
