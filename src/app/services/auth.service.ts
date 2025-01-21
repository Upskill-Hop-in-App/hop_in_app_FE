import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiUrl } from '../utils/api-url';
import { UserRegister, UserLogin } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(user: UserRegister): Observable<UserRegister> {
    const apiUrlRegister = ApiUrl.register;
    const headers = this.getHeaders();
    return this.http.post<UserRegister>(apiUrlRegister, user, { headers });
  }

  login(user: UserLogin): Observable<UserLogin> {
    const apiUrlLogin = ApiUrl.login;
    return this.http.post<UserLogin>(apiUrlLogin, user);
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/';
  }

  getUserId(): string {
    const user = localStorage.getItem('decodedUser');
    return user ? JSON.parse(user).id : null;
  }

  getUserName(): string {
    const user = localStorage.getItem('decodedUser');
    return user ? JSON.parse(user).username : null;
  }

  getUser(): string {
    const user = localStorage.getItem('decodedUser');
    return user ? JSON.parse(user) : null;
  }

  getUserIdCard(): string {
    const user = localStorage.getItem('decodedUser');
    return user ? JSON.parse(user).idCard : null;
  }

  getUserRole(): string | null {
    const user = localStorage.getItem('decodedUser');
    return user ? JSON.parse(user).userRole : null;
  }

  getUserStatus(): string {
    const user = localStorage.getItem('decodedUser');
    return user ? JSON.parse(user).status : null;
  }

  getToken(): string | null {
    return localStorage.getItem('userToken');
  }

  getHeaders(): HttpHeaders {
    const token = this.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  isAdminAuth(): boolean {
    const isAdmin = this.getUserRole() === 'admin';
    const isUserActive = this.getUserStatus() === 'active';
    return isAdmin && isUserActive;
  }

  isClientAuth(): boolean {
    const isClient = this.getUserRole() === 'client';
    const isUserActive = this.getUserStatus() === 'active';
    return isClient && isUserActive;
  }
}
