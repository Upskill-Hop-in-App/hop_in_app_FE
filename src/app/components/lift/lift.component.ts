import { Component, OnInit, ViewChild, Inject } from '@angular/core'
import { Lift } from '../../models/lift.model'
import { MyCar } from '../../models/my-car.model'
import { Application } from '../../models/application.model'
import { LiftService } from '../../services/lift.service'
import { FormsModule, Validators } from '@angular/forms'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms'
import { catchError, of } from 'rxjs'
import { ModalComponent } from '../modal/modal.component'
import { DOCUMENT } from '@angular/common'
import { AttachedIconPipe } from '../../pipes/attached-icon.pipe'
import { CommonModule } from '@angular/common'
import { ToastrService } from 'ngx-toastr'
import { ActivatedRoute, Router } from '@angular/router'
import { ApplicationService } from '../../services/application.service'
import { AuthService } from '../../services/auth.service'
import { MyCarService } from '../../services/my-car/my-car.service'

@Component({
  selector: 'app-lifts',
  standalone: true,
  imports: [
    FormsModule,
    ModalComponent,
    AttachedIconPipe,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './lift.component.html',
  styleUrl: './lift.component.css',
})
export class LiftComponent implements OnInit {
  lifts: Lift[] = []
  auxiliarLift: Lift = this.reset()
  showApplicationForm: boolean = false
  currentModalTitle: string = ''
  clientUsername: string = ''
  applicationForm = new FormGroup({
    passenger: new FormControl('', [Validators.required]),
    lift: new FormControl('', [Validators.required]),
  })
  filters: any = {
    cl: '',
    status: '',
    startPointDistrict: '',
    startPointMunicipality: '',
    startPointParish: '',
    endPointDistrict: '',
    endPointMunicipality: '',
    endPointParish: '',
    providedSeats: '',
    scheduleYear: '',
    scheduleMonth: '',
    scheduleDay: '',
    scheduleHour: '',
    driver: '',
    car: '',
  }
  filtersApplied = false

  @ViewChild(ModalComponent) modalComponent!: ModalComponent

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private LiftService: LiftService,
    private ApplicationService: ApplicationService,
    private AuthService: AuthService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getUsername()
    this.getLifts()
  }

  getUsername() {
    this.clientUsername = this.AuthService.getUserName()
  }

  getLifts(): void {
    this.LiftService.getLifts()
      .pipe(
        catchError((err) => {
          this.toastr.info('No lift found', err?.error?.message)
          return of([])
        })
      )
      .subscribe((data: Lift[]) => {
        this.lifts = data.filter((lift) => lift.status === 'open')
      })
  }

  cleanFilters(filters: any): any {
    return Object.entries(filters)
      .filter(
        ([key, value]) => value !== '' && value !== null && value !== undefined
      )
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  }

  applyFilters() {
    const query = this.buildQueryString(this.cleanFilters(this.filters))
    this.LiftService.filterLift(query).subscribe(
      (response) => {
        this.lifts = response.data.filter((lift) => lift.status === 'open')
        this.filtersApplied = true
      },
      (error) => {
        console.error(error)
        this.getLifts()
        this.filtersApplied = true
      }
    )
  }

  buildQueryString(filters: Record<string, string | number | boolean>): string {
    return Object.entries(filters)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join('&')
  }

  clearFilters() {
    this.getLifts()
    this.filters = {
      cl: '',
      status: '',
      startPointDistrict: '',
      startPointMunicipality: '',
      startPointParish: '',
      endPointDistrict: '',
      endPointMunicipality: '',
      endPointParish: '',
      providedSeats: '',
      scheduleYear: '',
      scheduleMonth: '',
      scheduleDay: '',
      scheduleHour: '',
      driver: '',
      car: '',
    }
  }

  openModal(): void {
    this.modalComponent.openModal()
  }

  reset(): Lift {
    return {
      _id: '',
      cl: '',
      driver: { username: '' },
      car: { cc: '' },
      startPoint: {
        district: '',
        municipality: '',
        parish: '',
      },
      endPoint: {
        district: '',
        municipality: '',
        parish: '',
      },
      schedule: null,
      providedSeats: 0,
      price: 0,
      createdAt: '',
      updatedAt: '',
      __v: '',
    }
  }

  resetForm() {
    this.applicationForm.reset()
  }

  cancel(): void {
    this.modalComponent.closeModal()
    this.resetForm()
  }

  toggleApplication(lift: Lift) {
    this.currentModalTitle = 'Applying to lift'
    this.showApplicationForm = true
    this.auxiliarLift = { ...lift }
    this.applicationForm.setValue({
      passenger: this.clientUsername!,
      lift: lift.cl!,
    })
    this.openModal()
  }

  confirmApplication(): void {
    const application: Application = {
      passenger: { username: this.applicationForm.value.passenger! },
      lift: { cl: this.applicationForm.value.lift! },
    }
    this.ApplicationService.createApplication(application).subscribe({
      next: () => {
        this.toastr.success('Application created successfully.')
        this.cancel()
        this.getLifts()
      },
      error: (err) => {
        this.toastr.error('Failed to create application.', err.error.error)
      },
    })
  }
}
