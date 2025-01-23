import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Application } from '../models/application.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = 'http://localhost:3000/api/applications';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getApplicationsByUsername(username: string): Observable<Application[]> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<{
        message: string;
        data: Application[];
      }>(this.apiUrl + '/username/' + username, { headers })
      .pipe(map((response) => response.data));
  }

  createApplication(application: Application): Observable<Application> {
    const headers = this.authService.getHeaders();
    return this.http.post<Application>(
      this.apiUrl,
      {
        passenger: application.passenger.username,
        lift: application.lift.cl,
      },
      { headers },
    );
  }

  acceptApplication(ca: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put(`${this.apiUrl}/accept/${ca}`, {}, { headers });
  }

  rejectApplication(ca: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put(`${this.apiUrl}/reject/${ca}`, {}, { headers });
  }

  cancelApplication(ca: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put(`${this.apiUrl}/cancel/${ca}`, {}, { headers });
  }

  filterApplicationsByUsername(username: string, query: string): Observable<{ message: string; data: Application[] }> {
    const headers = this.authService.getHeaders();
    const localURL = `${this.apiUrl}/filter/username/${username}?${query}`;
    return this.http.get<{ message: string; data: Application[] }>(localURL, { headers });
  }
}
