import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiUrl } from '../utils/api-url';
import { UserRegister, UserLogin, UserRoles } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(user: UserRegister): Observable<UserRegister> {
    let apiUrlRegister = ApiUrl.registerClient;
    if (user.role == UserRoles.admin) {
      apiUrlRegister = ApiUrl.registerAdmin;
    }

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

  getUser(): string {
    const user = localStorage.getItem('decodedUser');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): string {
    const user = localStorage.getItem('decodedUser');
    return user ? JSON.parse(user).id : null;
  }

  getUserName(): string {
    const user = localStorage.getItem('decodedUser');
    return user ? JSON.parse(user).username : null;
  }

  getUserRole(): UserRoles | null {
    const user = localStorage.getItem('decodedUser');
    return user ? JSON.parse(user).role : null;
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
    const isAdmin = this.getUserRole() === UserRoles.admin;
    return isAdmin;
  }

  isClientAuth(): boolean {
    const isClient = this.getUserRole() === UserRoles.client;
    return isClient;
  }

  isAnyUserAuth(): boolean {
    const isAnyUser = this.getUserRole();
    return !!isAnyUser;
  }
}
