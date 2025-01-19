import { Component, OnInit } from '@angular/core';
import { CarService } from '../../services/car.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-car',
  templateUrl: './component/cars.component.html',
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
    this.carService.create(this.car).subscribe(
      (response: any) => {
        this.loadCars();
      },
      (error: any) => {
        console.error('Error adding car:', error);
      }
    );
  }
}
