import { Injectable, model } from '@angular/core'
import { CarpoolApiUrl } from '../../../utils/api-url'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { MyCar } from '../../models/my-car.model'

@Injectable({
  providedIn: 'root',
})
export class MyCarService {
  apiUrlCars = CarpoolApiUrl.myCars

  constructor(private http: HttpClient) {}

  // CREATE

  create(myCar: MyCar): Observable<MyCar> {
    return this.http.post<MyCar>(this.apiUrlCars, {
      brand: myCar.brand,
      model: myCar.model,
      year: myCar.year,
      user: myCar.user,
      color: myCar.color,
      plate: myCar.plate,
    })
  }

  // READ

  // TODO: Think how to to this using GET with body or alternative
  // filterCars(username: string): Observable<MyCar[]> {
  //   return this.http
  //     .get<{ message: string; data: MyCar[] }>(`${this.apiUrlCars}/filter/username/${username}`)
  //     .pipe(map((res) => res.data))
  // }

  getCarByUsername(username: string): Observable<MyCar[]> {
    return this.http
      .get<{
        message: string
        data: MyCar[]
      }>(`${this.apiUrlCars}/username/${username}`)
      .pipe(map((res) => res.data))
  }

  // UPDATE

  updateCarByCode(oldCar: MyCar, updatedCar: MyCar): Observable<MyCar> {
    console.log('Old car CC:', oldCar.cc) // Check if cc exists
    console.log('Update payload:', {
      brand: updatedCar.brand,
      model: updatedCar.model,
      year: updatedCar.year,
      user: updatedCar.user,
      color: updatedCar.color,
      plate: updatedCar.plate,
    })
    return this.http.put<MyCar>(`${this.apiUrlCars}/${oldCar.cc}`, {
      brand: updatedCar.brand,
      model: updatedCar.model,
      year: updatedCar.year,
      user: updatedCar.user,
      color: updatedCar.color,
      plate: updatedCar.plate,
    })
  }

  // DELETE

  deleteCarByCode(cc: string): Observable<MyCar> {
    return this.http.delete<MyCar>(`${this.apiUrlCars}/${cc}`)
  }
}
