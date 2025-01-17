import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MyCar } from '../../models/my-car';
import myCars from '../../../utils/data/cars';
// import { MyCarService } from '../../services/my-car/my-car.service';
// import { ToastrService } from 'ngx-toastr';
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
import { AppModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-my-cars',
  imports: [AppModalComponent, CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './my-cars.component.html',
  styleUrl: './my-cars.component.css',
})
export class MyCarsComponent implements OnInit {
  cars: MyCar[] = [];
  title = 'My Cars';
  backupCar: MyCar = this.reset();
  auxiliarCar: MyCar = this.reset();
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  showDeleteForm: boolean = false;
  selectedFilter: string = 'all';
  inputFilter: string = '';
  curentModalTitle: string = '';
  carForm = new FormGroup({
    cc: new FormControl(''),
    brand: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    year: new FormControl(0, [Validators.required]),
    color: new FormControl('', [Validators.required]),
    plate: new FormControl('', [Validators.required]),
    confirmationCc: new FormControl(''),
  });

  @ViewChild(AppModalComponent) modalComponent!: AppModalComponent;
  // @ViewChild('filterSelect') filterSelect!: HTMLSelectElement;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    // private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    // private myCarService: MyCarService,
    // private toastr: ToastrService,
    library: FaIconLibrary,
  ) {
    library.addIcons(
      faHome,
      faPenToSquare,
      faTrashCanRegular,
      faTrashCanSolid,
      faPenToSquareSolid,
      faMagnifyingGlass,
      faFilterCircleXmark,
      faPlus,
    );
  }

  ngOnInit(): void {
    this.getMyCars();
  }

  getMyCars(): void {
    this.cars = myCars;
  }

  //#region Modal

  openModal(): void {
    this.modalComponent.openModal();
  }

  openCreateModal(): void {
    this.curentModalTitle = 'Add Car';
    this.showEditForm = false;
    this.showDeleteForm = false;
    this.showCreateForm = true;
    this.openModal();
    this.resetForm();
    this.changeDetector.detectChanges();
  }

  openEditModal(car: MyCar): void {
    this.curentModalTitle = 'Edit Car';
    this.showCreateForm = false;
    this.showDeleteForm = false;
    this.backupCar = { ...car };
    this.carForm.setValue({
      cc: car.cc!,
      brand: car.brand,
      model: car.model,
      year: car.year,
      color: car.color,
      plate: car.plate,
      confirmationCc: '',
    });
    this.showEditForm = true;
    this.openModal();
    this.changeDetector.detectChanges();
  }

  openDeleteModal(car: MyCar): void {
    this.curentModalTitle = 'Delete Car';
    this.showCreateForm = false;
    this.showEditForm = false;
    this.auxiliarCar = { ...car };
    this.carForm.setValue({
      cc: car.cc!,
      brand: car.brand,
      model: car.model,
      year: car.year,
      color: car.color,
      plate: car.plate,
      confirmationCc: '',
    });
    this.showDeleteForm = true;
    this.openModal();
    this.changeDetector.detectChanges();
  }

  closeModal(): void {
    this.modalComponent.closeModal();
    this.auxiliarCar = this.reset();
  }

  reset(): MyCar {
    return {
      cc: '',
      brand: '',
      model: '',
      year: 0,
      color: '',
      plate: '',
      // TODO: new Date makes sense????
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  resetForm() {
    this.carForm.reset();
  }

  getAllCountries(): void {}

  confirmCreate(): void {
    const newCar: MyCar = {
      cc: this.carForm.value.cc!,
      brand: this.carForm.value.brand!,
      model: this.carForm.value.model!,
      year: this.carForm.value.year!,
      color: this.carForm.value.color!,
      plate: this.carForm.value.plate!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // this.carService.create(newCar).subscribe({
    //   next: () => {
    //     this.toastr.success('Car added successfully');
    //     this.closeModal();
    //     this.getAllCountries();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err.error.error, 'Failed to add new car');
    //   },
    // });
  }

  confirmEdit(): void {
    this.auxiliarCar.cc = this.carForm.value.cc!;
    this.auxiliarCar.brand = this.carForm.value.brand!;
    this.auxiliarCar.model = this.carForm.value.model!;
    this.auxiliarCar.year = this.carForm.value.year!;
    this.auxiliarCar.color = this.carForm.value.color!;
    this.auxiliarCar.plate = this.carForm.value.plate!;
    // this.carService
    //   .update(this.backupCar, this.auxiliarCar)
    //   .subscribe({
    //     next: () => {
    //       this.toastr.success('Car updated successfully');
    //       this.closeModal();
    //       this.getAllCountries();
    //     },
    //     error: (err) => {
    //       this.toastr.error(err.error.error, 'Failed to update car');
    //     },
    //   });
  }

  confirmDelete(): void {
    // if (
    //   this.carForm.value.confirmationCc?.toUpperCase() !==
    //   this.auxiliarCar.cc?.toUpperCase()
    // ) {
    //   this.toastr.error(
    //     `The confirmation code does not match the car code. ${this.carForm.value.confirmationCc} - ${this.auxiliarCar.cc} `,
    //   );
    //   return;
    // }

    // this.carService.delete(this.auxiliarCar.cc!).subscribe({
    //   next: () => {
    //     this.toastr.success('Car deleted successfully');
    //     this.closeModal();
    //     this.getAllCountries();
    //   },
    //   error: (err) => {
    //     this.toastr.error(err.error.error, 'Failed to delete car');
    //     this.getAllCountries();
    //   },
    // });
  }
}
