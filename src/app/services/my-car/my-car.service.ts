import { Injectable } from '@angular/core';
import { ApiUrl } from '../../utils/api-url';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MyCar } from '../../models/my-car.model';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class MyCarService {
  apiUrlCars = ApiUrl.myCars;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  /* ------------------------------- CREATE -------------------------------- */

  create(myCar: MyCar): Observable<MyCar> {
    const headers = this.authService.getHeaders();
    return this.http.post<MyCar>(
      this.apiUrlCars,
      {
        brand: myCar.brand,
        model: myCar.model,
        year: myCar.year,
        user: myCar.user,
        color: myCar.color,
        plate: myCar.plate,
      },
      { headers },
    );
  }

  /* ------------------------------- READ -------------------------------- */

  getCarByUsername(username: string): Observable<MyCar[]> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<{
        message: string;
        data: MyCar[];
      }>(`${this.apiUrlCars}/username/${username}`, { headers })
      .pipe(map((res) => res.data));
  }

  /* ------------------------------- UPDATE -------------------------------- */

  updateCarByCode(oldCar: MyCar, updatedCar: MyCar): Observable<MyCar> {
    const headers = this.authService.getHeaders();
    return this.http.put<MyCar>(
      `${this.apiUrlCars}/${oldCar.cc}`,
      {
        brand: updatedCar.brand,
        model: updatedCar.model,
        year: updatedCar.year,
        user: updatedCar.user,
        color: updatedCar.color,
        plate: updatedCar.plate,
      },
      { headers },
    );
  }

  /* ------------------------------- DELETE -------------------------------- */

  deleteCarByCode(cc: string): Observable<MyCar> {
    const headers = this.authService.getHeaders();
    return this.http.delete<MyCar>(`${this.apiUrlCars}/${cc}`, { headers });
  }
}
