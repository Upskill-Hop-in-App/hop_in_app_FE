import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map} from 'rxjs';
import { Car } from '../models/car.model';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private carsUrl = 'http://localhost:3001/api/cars';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Car[]> {
    return this.http
    .get<{message: string; data: Car[]}>(this.carsUrl)
    .pipe(map((response) => response.data));
  }
  create(car: any): Observable<any> {
    return this.http.post(`${this.carsUrl}`, car);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.carsUrl}/${id}`);
  }

  update(id: number, car: any): Observable<Car> {
    return this.http.put<any>(`${this.carsUrl}/${id}`, car);
  }
}
