import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../utils/apiUrl';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Car } from '../../models/car.model';
import { ModelList } from '../../models/modelList';

@Injectable({
  providedIn: 'root',
})
export class MyCarService {
  apiUrlCountries = ApiUrl.cars;

  constructor(private http: HttpClient) {}

  // CREATE

  create(car: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrlCountries, {
      model: car.model,
      brand: car.brand,
      startYear: car.startYear,
      endYear: car.endYear,
    });
  }

  // READ

  getAll(): Observable<Car[]> {
    return this.http
      .get<{ message: string; data: Car[] }>(this.apiUrlCountries)
      .pipe(map((res) => res.data));
  }

  getByModel(model: string): Observable<ModelList> {
    return this.http
      .get<{ message: string; data: ModelList }>(`${this.apiUrlCountries}/${model}`)
      .pipe(map((res) => res.data));
  }

  verifyCar(brand: string, model: string, year: number): Observable<boolean> {
    return this.http
      .get<{
        message: string;
        data: boolean;
      }>(`${this.apiUrlCountries}/verify/${brand}/${model}/${year}`)
      .pipe(map((res) => res.data));
  }

  // UPDATE

  update(oldCar: Car, updatedCar: Car): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrlCountries}/${oldCar.brand}/${oldCar.brand}`, {
      model: updatedCar.model,
      brand: updatedCar.brand,
      startYear: updatedCar.startYear,
      endYear: updatedCar.endYear,
    });
  }

  // DELETE

  // delete(): Observable<Car> {
  //   return;
  // }
}
