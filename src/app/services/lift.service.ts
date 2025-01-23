import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Lift } from '../models/lift.model';
import { MyCar } from '../models/my-car.model';
import { AuthService } from './auth.service';

interface DistrictResponse {
  distrito: string;
  municipios: Municipio[];
}

interface Municipio {
  nome: string;
  codigoine: string;
}

interface MunicipioFreguesiaResponse {
  nome: string;
  freguesias: string[];
}

@Injectable({
  providedIn: 'root',
})
export class LiftService {
  private apiUrl = 'http://localhost:3000/api/lifts';
  private carsUrl = 'http://localhost:3000/api/cars';
  private districtsUrl = 'https://json.geoapi.pt/distritos';
  private parishUrl = 'https://json.geoapi.pt/municipio';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getLifts(): Observable<Lift[]> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<{ message: string; data: Lift[] }>(this.apiUrl, { headers })
      .pipe(map((response) => response.data));
  }

  getLiftByCode(cl: string): Observable<{ message: string; data: Lift }> {
    const headers = this.authService.getHeaders();
    const localURL = this.apiUrl + '/cl/' + cl;
    return this.http.get<{ message: string; data: Lift }>(localURL, {
      headers,
    });
  }

  filterLifts(query: string): Observable<{ message: string; data: Lift[] }> {
    const headers = this.authService.getHeaders();
    const localURL = `${this.apiUrl}/filter?${query}`;
    return this.http.get<{ message: string; data: Lift[] }>(localURL, {
      headers,
    });
  }

  filterLiftByUsername(query: string, username: string): Observable<{ message: string; data: Lift[] }> {
    const headers = this.authService.getHeaders();
    const localURL = `${this.apiUrl}/filter/username/${username}?${query}`;
    return this.http.get<{ message: string; data: Lift[] }>(localURL, {
      headers,
    });
  }

  checkInProgress(username: string): Observable<boolean> {
    const headers = this.authService.getHeaders();
    const localURL = `${this.apiUrl}/inProgress/${username}`
    return this.http.get<boolean>(localURL, { headers });
  }

  getRole(username: string): Observable<string> {
    const headers = this.authService.getHeaders();
    const localURL = `${this.apiUrl}/role/${username}`
    return this.http.get<string>(localURL, { headers });
  }
  
  createLift(lift: Lift): Observable<Lift> {
    const headers = this.authService.getHeaders();
    return this.http.post<Lift>(
      this.apiUrl,
      {
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
      },
      { headers },
    );
  }

  updateLift(oldLift: Lift, updatedLift: Lift): Observable<Lift> {
    const headers = this.authService.getHeaders();
    const localURL = this.apiUrl + '/' + oldLift.cl;
    return this.http.put<Lift>(
      localURL,
      {
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
      },
      { headers },
    );
  }

  getAllDistricts(): Observable<string[]> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<any[]>(this.districtsUrl, { headers })
      .pipe(map((response) => response.map((district) => district.distrito)));
  }

  getMunicipalitiesByDistrict(district: string): Observable<string[]> {
    const headers = this.authService.getHeaders();
    const url = `${this.districtsUrl}/${district}/municipios`;
    return this.http
      .get<DistrictResponse>(url, { headers })
      .pipe(
        map((response) =>
          response.municipios.map((municipio) => municipio.nome),
        ),
      );
  }

  getParishesByMunicipalities(municipio: string | null): Observable<string[]> {
    const headers = this.authService.getHeaders();
    const url = `${this.parishUrl}/${municipio}/freguesias`;
    return this.http
      .get<MunicipioFreguesiaResponse>(url, { headers })
      .pipe(map((response) => response.freguesias));
  }

  getCarsByUsername(username: string): Observable<MyCar[]> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<{
        message: string;
        data: MyCar[];
      }>(this.carsUrl + '/username/' + username, { headers })
      .pipe(map((response) => response.data));
  }

  getLiftsByUsername(username: string): Observable<Lift[]> {
    const headers = this.authService.getHeaders();
    return this.http
      .get<{
        message: string;
        data: Lift[];
      }>(this.apiUrl + '/username/' + username, { headers })
      .pipe(map((response) => response.data));
  }

  updateStatusLift(code: string, status: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put(`${this.apiUrl}/cl/status/${code}/${status}`, {}, { headers });
  }

  updateDriverRating(code: string, rating: number): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put(`${this.apiUrl}/cl/rating/${code}/${rating}`, {}, { headers });
  }
}
