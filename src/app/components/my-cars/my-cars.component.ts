import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { CommonModule, DOCUMENT } from '@angular/common'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs'
import { MyCar } from '../../models/my-car.model'
import { CarService } from '../../services/car/car.service'
import { ToastrService } from 'ngx-toastr'
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
import { ModalComponent } from '../modal/modal.component'
import { ModelList } from '../../models/modelList'
import { MyCarService } from '../../services/my-car/my-car.service'

@Component({
  selector: 'app-my-cars',
  imports: [
    ModalComponent,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  templateUrl: './my-cars.component.html',
  styleUrl: './my-cars.component.css',
})
export class MyCarsComponent implements OnInit {
  user = 'client1_name'
  cars: MyCar[] = []
  brands: string[] = []
  modelList: ModelList = {}
  models: string[] = []
  years: Number[] = []

  title = 'My Cars'
  selectedFilter: string = ''
  inputFilter: string = ''
  backupCar: MyCar = this.reset()
  auxiliarCar: MyCar = this.reset()
  showCreateForm: boolean = false
  showEditForm: boolean = false
  showDeleteForm: boolean = false
  curentModalTitle: string = ''
  carForm = new FormGroup({
    cc: new FormControl(''),
    brand: new FormControl('', [Validators.required]),
    model: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    year: new FormControl(0, [Validators.required]),
    color: new FormControl('', [Validators.required]),
    plate: new FormControl('', [Validators.required]),
    confirmationPlate: new FormControl(''),
  })

  @ViewChild(ModalComponent) modalComponent!: ModalComponent

  constructor(
    @Inject(DOCUMENT) private document: Document,
    // private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private carService: CarService,
    private myCarService: MyCarService,
    private toastr: ToastrService,
    library: FaIconLibrary
  ) {
    library.addIcons(
      faHome,
      faPenToSquare,
      faTrashCanRegular,
      faTrashCanSolid,
      faPenToSquareSolid,
      faMagnifyingGlass,
      faFilterCircleXmark,
      faPlus
    )
  }

  ngOnInit(): void {
    this.getMyCars()
    this.carForm = new FormGroup({
      cc: new FormControl(''),
      brand: new FormControl('', [Validators.required]),
      model: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      year: new FormControl(0, [Validators.required]),
      color: new FormControl('', [Validators.required]),
      plate: new FormControl('', [Validators.required]),
      confirmationPlate: new FormControl(''),
    })
  }

  /* ------------------------------- MODAL/ FORM GENERAL FUNCTIONS -------------------------------- */

  openModal(): void {
    this.modalComponent.openModal()
  }

  closeModal(): void {
    this.modalComponent.closeModal()
    this.auxiliarCar = this.reset()
  }

  reset(): MyCar {
    return {
      cc: '',
      brand: '',
      model: '',
      year: 0,
      user: '',
      color: '',
      plate: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  resetForm() {
    this.carForm.reset()
  }

  /* ------------------------------- CREATE MODAL -------------------------------- */

  openCreateModal(): void {
    // Add a loading state if needed
    this.carForm.get('brand')?.enable()
    this.getAllBrands().then(() => {
      this.curentModalTitle = 'Add Car'
      this.showEditForm = false
      this.showDeleteForm = false
      this.showCreateForm = true
      this.openModal()
      this.resetForm()
      this.changeDetector.detectChanges()
    })
  }

  confirmCreate(): void {
    const newCar: MyCar = {
      cc: this.carForm.value.cc!,
      brand: this.carForm.value.brand!,
      model: this.carForm.value.model!,
      year: this.carForm.value.year!,
      user: this.user,
      color: this.carForm.value.color!,
      plate: this.carForm.value.plate!,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.myCarService.create(newCar).subscribe({
      next: () => {
        this.toastr.success('Car added successfully')
        this.closeModal()
        this.getMyCars()
      },
      error: (err) => {
        this.toastr.error(err.error.error, 'Failed to add new car')
      },
    })
  }

  /* ------------------------------- EDIT MODAL -------------------------------- */

  openEditModal(car: MyCar): void {
    this.curentModalTitle = 'Edit Car'
    this.showCreateForm = false
    this.showDeleteForm = false
    this.backupCar = { ...car }

    this.carForm.get('brand')?.enable()
    this.carForm.get('model')?.enable()
    this.carForm.get('year')?.enable()

    this.carForm.setValue({
      cc: car.cc!,
      brand: car.brand,
      model: car.model,
      year: car.year,
      color: car.color,
      plate: car.plate,
      confirmationPlate: '',
    })

    this.carForm.get('brand')?.disable()
    this.carForm.get('model')?.disable()
    this.carForm.get('year')?.disable()

    this.showEditForm = true
    this.openModal()
    this.changeDetector.detectChanges()
  }

  confirmEdit(): void {
    this.auxiliarCar.brand = this.carForm.getRawValue().brand!
    this.auxiliarCar.model = this.carForm.getRawValue().model!
    this.auxiliarCar.year = this.carForm.getRawValue().year!
    this.auxiliarCar.user = this.user
    this.auxiliarCar.color = this.carForm.value.color!
    this.auxiliarCar.plate = this.carForm.value.plate!

    this.myCarService
      .updateCarByCode(this.backupCar, this.auxiliarCar)
      .subscribe({
        next: () => {
          this.toastr.success('Car updated successfully')
          this.closeModal()
          this.getMyCars()
        },
        error: (err) => {
          this.toastr.error(err.error.error, 'Failed to update car')
        },
      })
  }

  /* ------------------------------- DELETE MODAL -------------------------------- */

  openDeleteModal(car: MyCar): void {
    this.getAllBrands().then(() => {
      this.getAllModels(car.brand).then(() => {
        this.curentModalTitle = 'Delete Car'
        this.showCreateForm = false
        this.showEditForm = false
        this.auxiliarCar = { ...car }

        this.carForm.get('model')?.enable()

        this.carForm.patchValue({
          cc: car.cc!,
          brand: car.brand,
          model: car.model,
          year: car.year,
          color: car.color,
          plate: car.plate,
          confirmationPlate: '',
        })

        this.getAllYears(car.brand, car.model)

        this.showDeleteForm = true
        this.openModal()
        this.changeDetector.detectChanges()
      })
    })
  }

  confirmDelete(): void {
    if (
      this.carForm.value.confirmationPlate?.toUpperCase() !==
      this.auxiliarCar.plate?.toUpperCase()
    ) {
      this.toastr.error(
        `The confirmation code does not match the car code. ${this.carForm.value.confirmationPlate} - ${this.auxiliarCar.cc} `
      )
      return
    }
    this.myCarService.deleteCarByCode(this.auxiliarCar.cc!).subscribe({
      next: () => {
        this.toastr.success('Car deleted successfully')
        this.closeModal()
        this.getMyCars()
      },
      error: (err) => {
        this.toastr.error(err.error.error, 'Failed to delete car')
        this.getMyCars()
      },
    })
  }

  /* ------------------------------- HTML SELECT On Change -------------------------------- */

  getMyCars(): void {
    this.myCarService
      .getCarByUsername(this.user)
      .pipe(
        catchError((error) => {
          this.toastr.error(
            error.error?.error || 'Error',
            'Failed to get your cars'
          )
          return of([] as MyCar[])
        })
      )
      .subscribe((data) => {
        this.cars = data
      })
  }

  onBrandChange(): void {
    const selectedBrand = this.carForm.get('brand')?.value

    if (selectedBrand) {
      this.carForm.get('model')?.enable()
      this.models = []

      this.getAllModels(selectedBrand).then(() => {
        this.changeDetector.detectChanges()
      })
    } else {
      this.carForm.get('model')?.disable()
      this.models = []
    }
  }

  onModelChange(): void {
    const selectedBrand = this.carForm.get('brand')?.value!
    const selectedModel = this.carForm.get('model')?.value!

    if (selectedModel) {
      this.carForm.get('year')?.enable()
      this.years = []

      this.getAllYears(selectedBrand, selectedModel)
      this.changeDetector.detectChanges()
    } else {
      this.carForm.get('year')?.disable()
      this.years = []
    }
  }

  /* ------------------------------- Get CAR Fields Functions -------------------------------- */

  getAllBrands(): Promise<void> {
    return new Promise((resolve) => {
      this.carService
        .getBrands()
        .pipe(
          catchError((error) => {
            this.toastr.error(
              error.error?.error || 'Error',
              'Failed to get brands'
            )
            return of([] as string[])
          })
        )
        .subscribe({
          next: (data: string[]) => {
            this.brands = [...data]
            resolve()
          },
          error: () => {
            this.brands = []
            resolve()
          },
        })
    })
  }

  getAllModels(brand: string): Promise<void> {
    return new Promise((resolve) => {
      this.carService
        .getModels(brand)
        .pipe(
          catchError((error) => {
            this.toastr.error(
              error.error?.error || 'Error',
              'Failed to get models'
            )
            return of({} as ModelList)
          })
        )
        .subscribe({
          next: (data: ModelList) => {
            const brandModels = data[brand.toLowerCase()]
            this.modelList = { ...data }

            if (brandModels) {
              this.models = Object.keys(brandModels)
            } else {
              this.models = []
            }
            resolve()
          },
          error: () => {
            this.models = []
            resolve()
          },
        })
    })
  }

  getAllYears(brand: string, model: string): void {
    const currentYear = new Date().getFullYear()
    const years = []

    if (brand && model && this.modelList) {
      const brandData = this.modelList[brand]
      if (brandData && brandData[model]) {
        const { startYear, endYear } = this.modelList[brand][model]
        for (let i = startYear; i <= (endYear || currentYear); i++) {
          years.push(i)
        }
      }
    }
    this.years = [...years]
  }
}
