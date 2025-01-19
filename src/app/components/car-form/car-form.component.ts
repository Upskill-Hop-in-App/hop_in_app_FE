import { Component, EventEmitter, Output } from '@angular/core';
import { CarService } from '../../services/car.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent {
  car = {
    brand: '',
    model: '',
    startYear: 0,
    endYear: 0
  };

  @Output() formSubmit = new EventEmitter<void>();

  constructor(private carService: CarService) {}

  submitCar(): void {
    this.carService.create(this.car).subscribe(
      (response: any) => {
        console.log('Car added successfully', response);
        this.formSubmit.emit();
        this.resetForm();
      },
      (error: any) => {
        console.error('Error adding car', error);
      }
    );
  }

  resetForm(): void {
    this.car = {
      brand: '',
      model: '',
      startYear: 0,
      endYear: 0
    };
  }
}
