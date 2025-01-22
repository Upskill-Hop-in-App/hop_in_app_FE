import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
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
import {
  faPenToSquare,
  faTrashCan as faTrashCanRegular,
} from '@fortawesome/free-regular-svg-icons';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-manage-cars',
  standalone: true,
  imports: [
    CommonModule,
    //CarFormComponent,
    FormsModule,
    ReactiveFormsModule,
    AppModalComponent,
    FontAwesomeModule,
  ],
  templateUrl: './manage-cars.component.html',
  styleUrls: ['./manage-cars.component.css'],
})
export class ManageCarsComponent implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  title: string = 'Manage Cars';
  currentModalTitle: string = '';
  //showCreateButton: boolean = false;
  showUpdateButton: boolean = false;
  showDeleteButton: boolean = false;
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  showDeleteForm: boolean = false;
  carForm: FormGroup;
  filterForm: FormGroup;
  auxiliarCar: Partial<Car> = {};

  @ViewChild(AppModalComponent) modalComponent!: AppModalComponent;

  get brandControl(): FormControl {
    return this.filterForm.get('brand') as FormControl;
  }

  get modelControl(): FormControl {
    return this.filterForm.get('model') as FormControl;
  }
  constructor(
    private carService: CarService,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private document: Document,
    library: FaIconLibrary,
  ) {
    library.addIcons(
      faHome,
      faFilterCircleXmark,
      faPenToSquare,
      faTrashCanRegular,
      faPenToSquareSolid,
      faTrashCanSolid,
      faPlus,
      faMagnifyingGlass,
    );
    this.carForm = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      startYear: new FormControl('', [Validators.required]),
      endYear: new FormControl('', [Validators.required]),
      confirmationCc: new FormControl(''),
    });

    this.filterForm = new FormGroup({
      brand: new FormControl(''),
      model: new FormControl(''),
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
    this.carForm.get('confirmationCc')?.clearValidators();
    this.carForm.get('confirmationCc')?.updateValueAndValidity();
    this.openModal();
  }

  openUpdateModal(car: Car): void {
    this.currentModalTitle = 'Update Car';
    this.showCreateForm = false;
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
    this.showCreateForm = false;
    this.showUpdateButton = false;
    this.showDeleteButton = true;
    this.showDeleteForm;
    this.auxiliarCar = { ...car };
    this.carForm.patchValue({
      brand: car.brand,
      model: car.model,
      startYear: car.startYear,
      endYear: car.endYear,
      confirmationCc: '',
    });
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
          this.toastr.error('Failed to fetch cars.', err?.error?.error);
          return of([]);
        }),
      )
      .subscribe((data: Car[]) => {
        this.cars = data;
        this.filteredCars = data;
      });
  }
  filterCars(): void {
    const brand = this.filterForm.get('brand')?.value?.toLowerCase() || '';
    const model = this.filterForm.get('model')?.value?.toLowerCase() || '';

    this.cars = this.cars.filter(
      (car) =>
        car.brand.toLowerCase().includes(brand) &&
        car.model.toLowerCase().includes(model),
    );
  }

  clearFilter(): void {
    this.filterForm.reset();
    this.loadCars()
  }

  confirmCreate(): void {
    const newCar: Car = {
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
        console.error('Create failed:', err);
        this.toastr.error(err.error?.error || 'Failed to add new car');
      },
    });
  }
  confirmEdit(): void {
    const updatedCar: Car = {
      brand: this.carForm.value.brand!,
      model: this.carForm.value.model!,
      startYear: this.carForm.value.startYear!,
      endYear: this.carForm.value.endYear!,
    };

    this.carService
      .update(this.auxiliarCar.brand!, this.auxiliarCar.model!, updatedCar)
      .subscribe({
        next: () => {
          this.toastr.success('Car updated successfully');
          this.closeModal();
          this.loadCars();
        },
        error: (err) => {
          console.error('Update failed:', err);
          this.toastr.error(err.error?.error || 'Failed to update car');
        },
      });
  }

  confirmDelete(): void {
    console.log('Delete attempted');
    console.log('Form value:', this.carForm.value);
    console.log('Auxiliar car:', this.auxiliarCar);
    if (
      this.carForm.value.confirmationCc?.toUpperCase() !==
      this.auxiliarCar.brand?.toUpperCase()
    ) {
      console.log('Brand confirmation failed');
      this.toastr.error('The confirmation does not match the car brand.');
      return;
    }

    console.log(
      'Deleting car:',
      this.auxiliarCar.brand,
      this.auxiliarCar.model,
    );
    this.carService
      .delete(this.auxiliarCar.brand!, this.auxiliarCar.model!)
      .subscribe({
        next: () => {
          this.toastr.success('Car deleted successfully');
          this.closeModal();
          this.loadCars();
        },
        error: (err) => {
          console.log('Delete failed:', err);
          this.toastr.error(err.error?.error || 'Failed to delete car');
        },
      });
  }
}
