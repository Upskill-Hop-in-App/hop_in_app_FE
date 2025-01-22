import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = 'http://localhost:3000/api/applications';

  constructor(private http: HttpClient) {}

  createApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, {
      passenger: application.passenger.username,
      lift: application.lift.cl,
    });
  }

  acceptApplication(ca: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/accept/${ca}`, {});
  }

  rejectApplication(ca: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reject/${ca}`, {});
  }

  readyApplication(ca: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/ready/${ca}`, {});
  }

  updatePassengerRating(ca: string, rating: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/ca/rating/${ca}/${rating}`, {});
  }
}
