import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User, UserPassword } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  getUserByUsername(
    username: string,
  ): Observable<{ message: string; data: User }> {
    const localURL = this.apiUrl + '/username/' + username;
    return this.http.get<{ message: string; data: User }>(localURL);
  }

  updateProfile(username: string, updatedProfile: User): Observable<User> {
    const localURL = this.apiUrl + '/profile/' + username;
    return this.http.put<User>(localURL, updatedProfile);
  }

  updatePassword(
    username: string,
    updatedPassword: UserPassword,
  ): Observable<string> {
    const localURL = this.apiUrl + '/password/' + username;
    return this.http.put<string>(localURL, updatedPassword);
  }

  deleteUser(username: string) {
    const localURL = this.apiUrl + '/delete/' + username;
    return this.http.put<string>(localURL, {});
  }
}
