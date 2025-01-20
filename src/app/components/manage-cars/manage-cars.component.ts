import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CarService } from '../../services/car.service';
import { CarFormComponent } from '../car-form/car-form.component';
import { Car } from '../../models/car.model';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';


@Component({
  selector: 'app-manage-cars',
  standalone: true,
  imports: [CommonModule, CarFormComponent],
  templateUrl: './manage-cars.component.html',
  styleUrls: ['./manage-cars.component.css']
})
export class ManageCarsComponent implements OnInit {
  cars: Car[] = [];
  constructor(private carService: CarService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getAll()
    .pipe(
      catchError((err) => {
        this.toastr.error('Failed to fetch cars.', err?.error?.error);
        return of([]);
      }),
    )
    .subscribe((data: Car[]) => {
      this.cars = data;
    });
}
  createCar(car: any): void {
    const newCar = { ...car, brand: 'New Brand', model: 'New Model' };
    this.carService.create(newCar).subscribe({
      next: () => {
        console.log('Car created successfully.');
        this.loadCars();
      },
      error: (err) => {
        console.error('Failed to create car:', err);
      },
    });
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
