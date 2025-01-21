import { Component, OnInit } from '@angular/core';
import { CarService } from '../../services/car.service';
import { catchError, Observable } from 'rxjs';
import { response } from 'express';

@Component({
  selector: 'app-car',
  templateUrl: '../cars.component.html',
  //styleUrls: ['./component/cars.component.css']
})
export class CarComponent implements OnInit {
  cars$: Observable<any> = new Observable<any>();
  car = {
    brand: '',
    model: '',
    startYear: 0,
    endYear: 0
  };

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.cars$ = this.carService.getAll();
  }

  addCar(): void {
    this.carService.create(this.car).pipe(
      catchError((err) => {
        console.error('Failed to add car:', err);
        return new Observable();
      })
    ).subscribe(() => {
      this.loadCars();
    });
  }
}
