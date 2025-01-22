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
  create(car: Car): Observable<Car> {
    return this.http.post<Car>(`${this.carsUrl}`, car);
  }

  delete(brand: string, model: string): Observable<void> {
    return this.http.delete<void>(`${this.carsUrl}/${brand}/${model}`);
  }

  update(brand: string, model: string, car: Car): Observable<Car> {
    return this.http.put<Car>(`${this.carsUrl}/${brand}/${model}`, car);
  }
}
