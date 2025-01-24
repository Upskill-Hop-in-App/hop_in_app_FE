import { Component, OnInit, ViewChild, Inject } from '@angular/core'
import { CommonModule, formatCurrency } from '@angular/common'
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms'
import { CarService } from '../../services/car/car.service'
import { Car } from '../../models/car.model'
import { DOCUMENT } from '@angular/common'
import { ToastrService } from 'ngx-toastr'
import { ModalComponent } from '../modal/modal.component'
import {
  faMagnifyingGlass,
  faFilterCircleXmark,
  faPlus,
  faHome,
  faPenToSquare as faPenToSquareSolid,
  faTrashCan as faTrashCanSolid,
} from '@fortawesome/free-solid-svg-icons'
import {
  faPenToSquare,
  faTrashCan as faTrashCanRegular,
} from '@fortawesome/free-regular-svg-icons'
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome'
import { catchError, of } from 'rxjs'

@Component({
  selector: 'app-manage-cars',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    FontAwesomeModule,
  ],
  templateUrl: './manage-cars.component.html',
  styleUrls: ['./manage-cars.component.css'],
})
export class ManageCarsComponent implements OnInit {
  cars: Car[] = []
  title: string = 'Manage Cars'
  currentModalTitle: string = ''
  showUpdateButton: boolean = false
  showDeleteButton: boolean = false
  showCreateForm: boolean = false
  showEditForm: boolean = false
  showDeleteForm: boolean = false
  carForm: FormGroup
  filterForm: FormGroup
  auxiliarCar: Partial<Car> = {}
  backupCar: Partial<Car> = {}

  @ViewChild(ModalComponent) modalComponent!: ModalComponent

  get brandControl(): FormControl {
    return this.filterForm.get('brand') as FormControl
  }
  get modelControl(): FormControl {
    return this.filterForm.get('model') as FormControl
  }

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
    )
    this.carForm = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      startYear: new FormControl('', [Validators.required]),
      endYear: new FormControl('', [Validators.required]),
      confirmationCc: new FormControl(''),
    })
    this.filterForm = new FormGroup({
      brand: new FormControl(''),
      model: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.loadCars()
  }

  openModal(): void {
    this.modalComponent.openModal()
  }

  openCreateModal(): void {
    this.currentModalTitle = 'Create Car'
    this.showCreateForm = true
    this.showUpdateButton = false
    this.showDeleteButton = false
    this.carForm.reset()
    this.openModal()
  }

  openUpdateModal(car: Car): void {
    this.currentModalTitle = 'Update Car'
    this.showUpdateButton = true
    this.showCreateForm = false
    this.showDeleteButton = false
    this.carForm.setValue({
      brand: car.brand,
      model: car.model,
      startYear: car.startYear,
      endYear: car.endYear,
      confirmationCc: '',
    })
    this.backupCar = { ...car }
    this.openModal()
  }

  openDeleteModal(car: Car): void {
    this.currentModalTitle = 'Delete Car'
    this.showCreateForm = false
    this.showUpdateButton = false
    this.showDeleteButton = true
    this.auxiliarCar = { ...car }
    this.carForm.patchValue({
      brand: car.brand,
      model: car.model,
      startYear: car.startYear,
      endYear: car.endYear,
      confirmationCc: '',
    })
    this.openModal()
  }

  closeModal(): void {
    this.modalComponent.closeModal()
  }

  loadCars(): void {
    this.carService
      .getAll()
      .pipe(
        catchError((err) => {
          console.error('Failed to fetch cars:', err)
          this.toastr.error('Failed to fetch cars.', err?.error?.error)
          return of([])
        })
      )
      .subscribe((data: Car[]) => {
        this.cars = data
      })
  }

  confirmCreate(): void {
    const newCar: Car = {
      id: '0',
      brand: this.carForm.value.brand!,
      model: this.carForm.value.model!,
      startYear: this.carForm.value.startYear!,
      endYear: this.carForm.value.endYear!,
    }

    this.carService.create(newCar).subscribe({
      next: () => {
        this.toastr.success('Car added successfully')
        this.closeModal()
        this.loadCars()
      },
      error: (err) => {
        this.toastr.error(err.error.error, 'Failed to add new car')
      },
    })
  }

  confirmEdit(): void {
    this.auxiliarCar.brand = this.carForm.value.brand!
    this.auxiliarCar.model = this.carForm.value.model!
    this.auxiliarCar.startYear = this.carForm.value.startYear!
    this.auxiliarCar.endYear = this.carForm.value.endYear!

    this.carService.update(this.backupCar, this.auxiliarCar).subscribe({
      next: () => {
        this.toastr.success('Car updated successfully')
        this.closeModal()
        this.loadCars()
      },
      error: (err) => {
        this.toastr.error(err.error.error, 'Failed to update car')
      },
    })
  }

  confirmDelete(): void {
    this.auxiliarCar.brand = this.carForm.value.brand
    this.auxiliarCar.model = this.carForm.value.model
    this.auxiliarCar.startYear = this.carForm.value.startYear
    this.auxiliarCar.endYear = this.carForm.value.endYear

    if (
      this.carForm.value.confirmationCc?.toUpperCase() !==
      this.auxiliarCar.brand?.toUpperCase()
    ) {
      this.toastr.error('The confirmation does not match the car brand.')
      return
    }

    this.carService.delete(this.auxiliarCar).subscribe({
      next: () => {
        this.toastr.success('Car deleted successfully')
        this.closeModal()
        this.loadCars()
      },
      error: (err) => {
        this.toastr.error(err.error.error, 'Failed to delete car')
      },
    })
  }
  filterCars(): void {
    const brand = this.filterForm.get('brand')?.value?.toLowerCase() || ''
    const model = this.filterForm.get('model')?.value?.toLowerCase() || ''

    this.cars = this.cars.filter(
      (car) =>
        car.brand.toLowerCase().includes(brand) &&
        car.model.toLowerCase().includes(model)
    )
  }

  clearFilter(): void {
    this.filterForm.reset()
    this.loadCars()
  }
}
