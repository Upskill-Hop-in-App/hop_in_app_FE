import { Injectable } from '@angular/core'
import { CarApiUrl } from '../../../utils/api-url'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { Car } from '../../models/car.model'
import { ModelList } from '../../models/modelList'

@Injectable({
  providedIn: 'root',
})
export class CarService {
  apiUrlCars = CarApiUrl.cars

  constructor(private http: HttpClient) {}

  // CREATE

  create(car: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrlCars, {
      model: car.model,
      brand: car.brand,
      startYear: car.startYear,
      endYear: car.endYear,
    })
  }

  // READ

  getAll(): Observable<Car[]> {
    return this.http
      .get<{ message: string; data: Car[] }>(this.apiUrlCars)
      .pipe(map((res) => res.data))
  }

  getBrands(): Observable<string[]> {
    return this.http
      .get<{ message: string; data: string[] }>(`${this.apiUrlCars}/brands`)
      .pipe(map((res) => res.data))
  }

  getModels(brand: string): Observable<ModelList> {
    return this.http
      .get<{
        message: string
        data: ModelList
      }>(`${this.apiUrlCars}/brand/${brand}`)
      .pipe(map((res) => res.data))
  }

  getByModel(model: string): Observable<ModelList> {
    return this.http
      .get<{ message: string; data: ModelList }>(`${this.apiUrlCars}/${model}`)
      .pipe(map((res) => res.data))
  }

  verifyCar(brand: string, model: string, year: number): Observable<boolean> {
    return this.http
      .get<{
        message: string
        data: boolean
      }>(`${this.apiUrlCars}/verify/${brand}/${model}/${year}`)
      .pipe(map((res) => res.data))
  }

  // UPDATE

  update(oldCar: Car, updatedCar: Car): Observable<Car> {
    return this.http.put<Car>(
      `${this.apiUrlCars}/${oldCar.brand}/${oldCar.brand}`,
      {
        model: updatedCar.model,
        brand: updatedCar.brand,
        startYear: updatedCar.startYear,
        endYear: updatedCar.endYear,
      }
    )
  }

  // DELETE

  delete(): Observable<Car> {
    return this.http.delete<Car>(this.apiUrlCars)
  }
}
