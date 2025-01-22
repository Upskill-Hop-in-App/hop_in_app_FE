import { Injectable } from '@angular/core';
import { ApiUrl } from '../../utils/api-url';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Car } from '../../models/car.model';
import { ModelList } from '../../models/modelList.model';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  apiUrlCars = ApiUrl.cars;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  /* ------------------------------- CREATE -------------------------------- */

  create(car: Car): Observable<Car> {
    const headers = this.authService.getHeaders();
    return this.http.post<Car>(
      this.apiUrlCars,
      {
        model: car.model,
        brand: car.brand,
        startYear: car.startYear,
        endYear: car.endYear,
      },
      { headers },
    );
  }

  // READ

  getAll(): Observable<Car[]> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<{ message: string; data: Car[] }>(this.apiUrlCars, { headers })
      .pipe(map((res) => res.data));
  }

  getBrands(): Observable<string[]> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<{
        message: string;
        data: string[];
      }>(`${this.apiUrlCars}/brands`, { headers })
      .pipe(map((res) => res.data));
  }

  getModels(brand: string): Observable<ModelList> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<{
        message: string;
        data: ModelList;
      }>(`${this.apiUrlCars}/brand/${brand}`, { headers })
      .pipe(map((res) => res.data));
  }

  getByModel(model: string): Observable<ModelList> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<{
        message: string;
        data: ModelList;
      }>(`${this.apiUrlCars}/${model}`, { headers })
      .pipe(map((res) => res.data));
  }

  verifyCar(brand: string, model: string, year: number): Observable<boolean> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<{
        message: string;
        data: boolean;
      }>(`${this.apiUrlCars}/verify/${brand}/${model}/${year}`, { headers })
      .pipe(map((res) => res.data));
  }

  /* ------------------------------- UPDATE -------------------------------- */

  update(oldCar: Car, updatedCar: Car): Observable<Car> {
    const headers = this.authService.getHeaders();
    return this.http.put<Car>(
      `${this.apiUrlCars}/${oldCar.brand}/${oldCar.brand}`,
      {
        model: updatedCar.model,
        brand: updatedCar.brand,
        startYear: updatedCar.startYear,
        endYear: updatedCar.endYear,
      },
      { headers },
    );
  }

  /* ------------------------------- DELETE -------------------------------- */

  delete(): Observable<Car> {
    const headers = this.authService.getHeaders();
    return this.http.delete<Car>(this.apiUrlCars, { headers });
  }
}
