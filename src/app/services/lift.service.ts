import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Lift } from '../models/lift.model';
import { MyCar } from '.././models/my-car.model';

@Injectable({
    providedIn: 'root',
})
export class LiftService {
    private apiUrl = 'http://localhost:3000/api/lifts';
    private carsUrl = 'http://localhost:3000/api/cars';

    constructor(private http: HttpClient) {}
}