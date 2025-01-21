import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { CarFormComponent } from '../car-form/car-form.component';
import { Car } from '../../models/car.model';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AppModalComponent } from '../modal/modal.component';
import {
  faMagnifyingGlass,
  faFilterCircleXmark,
  faPlus,
  faHome,
  faPenToSquare as faPenToSquareSolid,
  faTrashCan as faTrashCanSolid,
} from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan as faTrashCanRegular } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-manage-cars',
  standalone: true,
  imports: [
    CommonModule,
    CarFormComponent,
    FormsModule,
    ReactiveFormsModule,
    AppModalComponent,
    FontAwesomeModule
  ],
  templateUrl: './manage-cars.component.html',
  styleUrls: ['./manage-cars.component.css'],
})
export class ManageCarsComponent implements OnInit {
  cars: Car[] = [];
  title: string = 'Manage Cars';
  currentModalTitle: string = '';
  //showCreateButton: boolean = false;
  showUpdateButton: boolean = false;
  showDeleteButton: boolean = false;
  showCreateForm: boolean = false;
  showEditForm: boolean = false
  showDeleteForm: boolean = false
  carForm: FormGroup;
  auxiliarCar: Partial<Car> = {};

  @ViewChild(AppModalComponent) modalComponent!: AppModalComponent;

  constructor(
    private carService: CarService,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private document: Document,
    library: FaIconLibrary
  ) {
    library.addIcons(
      faHome,
      faFilterCircleXmark,
      faPenToSquare,
      faTrashCanRegular,
      faPenToSquareSolid,
      faTrashCanSolid,
      faPlus,
      faMagnifyingGlass
    );
    this.carForm = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      startYear: new FormControl('', [Validators.required]),
      endYear: new FormControl('', [Validators.required]),
      confirmationCc: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadCars();
  }

  openModal(): void {
    this.modalComponent.openModal();
  }

  openCreateModal(): void {
    this.currentModalTitle = 'Create Car';
    this.showCreateForm = true;
    this.showUpdateButton = false;
    this.showDeleteButton = false;
    this.carForm.reset();
    this.openModal();
  }

  openUpdateModal(car: Car): void {
    this.currentModalTitle = 'Update Car';
    this.showUpdateButton = true;
    this.showDeleteButton = false;
    this.carForm.setValue({
      brand: car.brand,
      model: car.model,
      startYear: car.startYear,
      endYear: car.endYear,
      confirmationCc: '',
    });
    this.auxiliarCar = { ...car };
    this.openModal();
  }

  openDeleteModal(car: Car): void {
    this.currentModalTitle = 'Delete Car';
    this.showUpdateButton = false;
    this.showDeleteButton = true;
    this.auxiliarCar = { ...car };
    this.carForm.patchValue({
      brand: car.brand,
      model: car.model,
      startYear: car.startYear,
      endYear: car.endYear,
      confirmationCc: '', 
    })
    this.openModal();
  }

  closeModal(): void {
    this.modalComponent.closeModal();
  }

  loadCars(): void {
    this.carService
      .getAll()
      .pipe(
        catchError((err) => {
          console.error('Failed to fetch cars:', err);
          this.toastr.error('Failed to fetch cars.', err?.error?.error);
          return of([]);
        })
      )
      .subscribe((data: Car[]) => {
        console.log('Cars loaded:', data);
        this.cars = data;
      });
  }

  confirmCreate(): void {
    const newCar: Car = {
      id: '0',
      brand: this.carForm.value.brand!,
      model: this.carForm.value.model!,
      startYear: this.carForm.value.startYear!,
      endYear: this.carForm.value.endYear!,
    };

    this.carService.create(newCar).subscribe({
      next: () => {
        this.toastr.success('Car added successfully');
        this.closeModal();
        this.loadCars();
      },
      error: (err) => {
        this.toastr.error(err.error.error, 'Failed to add new car');
      },
    });
  }

  confirmEdit(): void {
    const updatedCar: Partial<Car> = {
      brand: this.carForm.value.brand!,
      model: this.carForm.value.model!,
      startYear: this.carForm.value.startYear!,
      endYear: this.carForm.value.endYear!,
    };

    this.carService.update(Number(this.auxiliarCar.id!), updatedCar).subscribe({
      next: () => {
        this.toastr.success('Car updated successfully');
        this.closeModal();
        this.loadCars();
      },
      error: (err) => {
        this.toastr.error(err.error.error, 'Failed to update car');
      },
    });
  }

  confirmDelete(): void {
    if (this.carForm.value.confirmationCc?.toUpperCase() !== this.auxiliarCar.brand?.toUpperCase()) {
      this.toastr.error('The confirmation does not match the car brand.');
      return;
    }

    this.carService.delete(Number(this.auxiliarCar.id!)).subscribe({
      next: () => {
      this.toastr.success('Car deleted successfully');
      this.closeModal();
      this.loadCars();
      },
      error: (err) => {
      this.toastr.error(err.error.error, 'Failed to delete car');
      },
    });
  }
}
