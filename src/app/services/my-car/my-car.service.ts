import { Injectable, model } from '@angular/core'
import { CarpoolApiUrl } from '../../../utils/api-url'
import { HttpClient, HttpRequest } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { MyCar } from '../../models/my-car.model'

@Injectable({
  providedIn: 'root',
})
export class MyCarService {
  apiUrlCars = CarpoolApiUrl.myCars

  constructor(private http: HttpClient) {}

  /* ------------------------------- CREATE -------------------------------- */

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

  /* ------------------------------- READ -------------------------------- */

  filterCars(
    username: string,
    filterName: string,
    filter: string
  ): Observable<MyCar[]> {
    return this.http.request<MyCar[]>(
      'GET',
      `${this.apiUrlCars}/username/${username}`,
      { body: { [filterName]: filter } }
    )
  }

  getCarByUsername(username: string): Observable<MyCar[]> {
    return this.http
      .get<{
        message: string
        data: MyCar[]
      }>(`${this.apiUrlCars}/username/${username}`)
      .pipe(map((res) => res.data))
  }

  /* ------------------------------- UPDATE -------------------------------- */

  updateCarByCode(oldCar: MyCar, updatedCar: MyCar): Observable<MyCar> {
    return this.http.put<MyCar>(`${this.apiUrlCars}/${oldCar.cc}`, {
      brand: updatedCar.brand,
      model: updatedCar.model,
      year: updatedCar.year,
      user: updatedCar.user,
      color: updatedCar.color,
      plate: updatedCar.plate,
    })
  }

  /* ------------------------------- DELETE -------------------------------- */

  deleteCarByCode(cc: string): Observable<MyCar> {
    return this.http.delete<MyCar>(`${this.apiUrlCars}/${cc}`)
  }
}
