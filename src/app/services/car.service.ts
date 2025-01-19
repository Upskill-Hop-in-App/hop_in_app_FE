import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private carsUrl = 'http://localhost:3000/api/cars';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.carsUrl);
  }
  create(car: any): Observable<any> {
    return this.http.post('/api/cars', car);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.carsUrl}/${id}`);
  }

  update(id: number, car: any): Observable<any> {
    return this.http.put<any>(`${this.carsUrl}/${id}`, car);
  }
}
