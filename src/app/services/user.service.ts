import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User, UserPassword } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getUserByUsername(
    username: string,
  ): Observable<{ message: string; data: User }> {
    const headers = this.authService.getHeaders();
    const localURL = this.apiUrl + '/username/' + username;
    return this.http.get<{ message: string; data: User }>(localURL, {
      headers,
    });
  }

  updateProfile(username: string, updatedProfile: User): Observable<User> {
    const headers = this.authService.getHeaders();
    const localURL = this.apiUrl + '/profile/' + username;
    return this.http.put<User>(localURL, updatedProfile, {
      headers,
    });
  }

  updatePassword(
    username: string,
    updatedPassword: UserPassword,
  ): Observable<string> {
    const headers = this.authService.getHeaders();
    const localURL = this.apiUrl + '/password/' + username;
    return this.http.put<string>(localURL, updatedPassword, {
      headers,
    });
  }

  deleteUser(username: string) {
    const headers = this.authService.getHeaders();
    const localURL = this.apiUrl + '/delete/' + username;
    return this.http.put<string>(
      localURL,
      {},
      {
        headers,
      },
    );
  }
}
