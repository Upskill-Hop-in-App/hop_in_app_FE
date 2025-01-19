import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CarService } from '../../services/car.service';
import { CarFormComponent } from '../car-form/car-form.component';

@Component({
  selector: 'app-manage-cars',
  standalone: true,
  imports: [CommonModule, CarFormComponent],
  templateUrl: './manage-cars.component.html',
  styleUrls: ['./manage-cars.component.css']
})
export class ManageCarsComponent implements OnInit {
  cars$: Observable<any> = new Observable<any>();

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.cars$ = this.carService.getAll();
  }

  updateCar(car: any): void {
    const updatedCar = { ...car, brand: 'Updated Brand', model: 'Updated Model' };
    this.carService.update(car.id, updatedCar).subscribe({
      next: () => {
        console.log(`Car with ID ${car.id} updated successfully.`);
        this.loadCars();
      },
      error: (err) => {
        console.error(`Failed to update car with ID ${car.id}:`, err);
      },
    });
  }

  deleteCar(car: any): void {
    this.carService.delete(car.id).subscribe({
      next: () => {
        console.log(`Car with ID ${car.id} deleted successfully.`);
        this.loadCars();
      },
      error: (err) => {
        console.error(`Failed to delete car with ID ${car.id}:`, err);
      },
    });
  }
}
