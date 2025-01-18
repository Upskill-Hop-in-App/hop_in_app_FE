import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Lift } from '../models/lift.model';

@Injectable({
  providedIn: 'root',
})
export class LiftService {
  private apiUrl = 'http://localhost:3000/api/lifts';

  constructor(private http: HttpClient) {}

  getLifts(): Observable<Lift[]> {
    return this.http
      .get<{ message: string; data: Lift[] }>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getLiftByCode(cl: string): Observable<{ message: string; data: Lift }> {
    const localURL = this.apiUrl + '/cl/' + cl;
    return this.http.get<{ message: string; data: Lift }>(localURL);
  }

  filterLift(query: string): Observable<{ message: string; data: Lift[] }> {
    const localURL = this.apiUrl + '/filter/' + query;
    return this.http.get<{ message: string; data: Lift[] }>(localURL);
  }

  createLift(lift: Lift): Observable<Lift> {
    return this.http.post<Lift>(this.apiUrl, {
      driver: lift.driver.username,
      car: lift.car.cc,
      startPoint: {
        district: lift.startPoint.district,
        municipality: lift.startPoint.municipality,
        parish: lift.startPoint.parish,
      },
      endPoint: {
        district: lift.endPoint.district,
        municipality: lift.endPoint.municipality,
        parish: lift.endPoint.parish,
      },
      schedule: lift.schedule,
      price: lift.price,
      providedSeats: lift.providedSeats,
    });
  }

  updateLift(oldLift: Lift, updatedLift: Lift): Observable<Lift> {
    const localURL = this.apiUrl + '/' + oldLift.cl;
    return this.http.put<Lift>(localURL, {
      driver: updatedLift.driver.username,
      car: updatedLift.car.cc,
      startPoint: {
        district: updatedLift.startPoint.district,
        municipality: updatedLift.startPoint.municipality,
        parish: updatedLift.startPoint.parish,
      },
      endPoint: {
        district: updatedLift.endPoint.district,
        municipality: updatedLift.endPoint.municipality,
        parish: updatedLift.endPoint.parish,
      },
      schedule: updatedLift.schedule,
      price: updatedLift.price,
      providedSeats: updatedLift.providedSeats,
    });
  }
}
