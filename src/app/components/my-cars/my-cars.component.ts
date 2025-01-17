import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-my-cars',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './my-cars.component.html',
  styleUrl: './my-cars.component.css'
})
export class MyCarsComponent implements OnInit {
  cars: Car[] = [];
  title = 'My Cars';
  counter = 0;

  constructor() { }

  ngOnInit(): void {
    
  }

  getCarsAllCars(): void {
    this.cars = new Array<Car>();
  }
}
