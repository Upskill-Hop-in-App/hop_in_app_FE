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
import { DOCUMENT, TitleCasePipe, UpperCasePipe } from '@angular/common'
import { AttachedIconPipe } from '../../pipes/attached-icon.pipe'
import { CommonModule } from '@angular/common'
import { ToastrService } from 'ngx-toastr'
import { ActivatedRoute, Router } from '@angular/router'
import { ApplicationService } from '../../services/application.service'
import { RouterLink } from '@angular/router'
import { QueryParamsHandling } from '@angular/router'
import { RouterModule } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { MyCarService } from '../../services/my-car/my-car.service'

@Component({
  selector: 'app-myLifts',
  standalone: true,
  imports: [
    FormsModule,
    ModalComponent,
    AttachedIconPipe,
    CommonModule,
    ReactiveFormsModule,
    TitleCasePipe,
    UpperCasePipe,
    RouterModule,
  ],
  templateUrl: './my-lifts.component.html',
  styleUrl: './my-lifts.component.css',
})
export class MyLiftsComponent implements OnInit {
  lifts: Lift[] = []
  lift: Lift = this.reset()
  cars: MyCar[] = []
  startDistricts: string[] = []
  startMunicipalities: string[] = []
  startParishes: string[] = []
  endDistricts: string[] = []
  endMunicipalities: string[] = []
  endParishes: string[] = []
  selectedStartDistrict: string | null = null
  selectedStartMunicipality: string | null = null
  selectedEndDistrict: string | null = null
  selectedEndMunicipality: string | null = null
  auxiliarLift: Lift = this.reset()
  showCreateForm: boolean = false
  showApplicationForm: boolean = false
  showCancelStatus: boolean = false
  currentLiftCode: string = ''
  newStatus: string = ''
  // backupLift: Lift = this.reset();
  showDeleteForm: boolean = false
  showEditForm: boolean = false
  currentModalTitle: string = ''
  flagStart: boolean = false
  liftFlags: { [key: string]: boolean } = {}

  //TODO mudar aqui para ir busca-lo ao token
  clientUsername: string = 'admin1_user'

  liftForm = new FormGroup({
    driver: new FormControl('', [Validators.required]),
    car: new FormControl('', [Validators.required]),
    startDistrict: new FormControl('', [Validators.required]),
    startMunicipality: new FormControl('', [Validators.required]),
    startParish: new FormControl('', [Validators.required]),
    endDistrict: new FormControl('', [Validators.required]),
    endMunicipality: new FormControl('', [Validators.required]),
    endParish: new FormControl('', [Validators.required]),
    schedule: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    providedSeats: new FormControl(null, [
      Validators.required,
      Validators.min(1),
    ]),
    occupiedSeats: new FormControl(0, [Validators.min(0)]),
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
    private MyCarService: MyCarService,
    private AuthService: AuthService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getUsername()
    this.getLiftsByUsername(this.clientUsername)
    this.loadStartDistricts()
    this.loadEndDistricts()
  }

  getUsername() {
    this.clientUsername = this.AuthService.getUserName()
  }

  getLiftsByUsername(username: string): void {
    this.LiftService.getLiftsByUsername(this.clientUsername)
      .pipe(
        catchError((err) => {
          this.toastr.info('No lift found', err?.error?.message)
          return of([])
        })
      )
      .subscribe((data: Lift[]) => {
        this.lifts = data
        this.updateLiftFlags(this.lifts)
      })
  }

  getCars(): void {
    this.MyCarService.getCarByUsername(this.clientUsername)
      .pipe(
        catchError((err) => {
          this.toastr.info('No car found', err?.error?.message)
          return of([])
        })
      )
      .subscribe((data: MyCar[]) => {
        this.cars = data
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
    this.LiftService.filterLifts(query).subscribe(
      (response) => {
        this.lifts = response.data.filter(
          (lift) => lift.driver.username === this.clientUsername
        )
        this.filtersApplied = true
      },
      (error) => {
        console.error(error)
        this.lifts = []
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
    this.getLiftsByUsername(this.clientUsername)
    this.filters = {
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
      car: '',
    }
  }

  loadStartDistricts(): void {
    this.LiftService.getAllDistricts()
      .pipe(
        catchError((err) => {
          this.toastr.error('No district found', err?.error?.message)
          return of([])
        })
      )
      .subscribe((districts: string[]) => {
        this.startDistricts = districts
      })
  }

  loadEndDistricts(): void {
    this.LiftService.getAllDistricts()
      .pipe(
        catchError((err) => {
          this.toastr.error('No district found', err?.error?.message)
          return of([])
        })
      )
      .subscribe((districts: string[]) => {
        this.endDistricts = districts
      })
  }

  onStartDistrictChange(event: any) {
    this.selectedStartDistrict = event.target.value
    this.loadStartMunicipalities()
  }

  loadStartMunicipalities(): void {
    if (this.selectedStartDistrict) {
      this.LiftService.getMunicipalitiesByDistrict(this.selectedStartDistrict)
        .pipe(
          catchError((err) => {
            this.toastr.error(
              'Failed to load municipalities',
              err?.error?.message
            )
            return of([])
          })
        )
        .subscribe((municipalities: string[]) => {
          this.startMunicipalities = municipalities
          this.liftForm.get('startPoint.municipality')?.enable()
        })
    }
  }

  onEndDistrictChange(event: any) {
    this.selectedEndDistrict = event.target.value
    this.loadEndMunicipalities()
  }

  loadEndMunicipalities(): void {
    if (this.selectedEndDistrict) {
      this.LiftService.getMunicipalitiesByDistrict(this.selectedEndDistrict)
        .pipe(
          catchError((err) => {
            this.toastr.error(
              'Failed to load municipalities',
              err?.error?.message
            )
            return of([])
          })
        )
        .subscribe((municipalities: string[]) => {
          this.endMunicipalities = municipalities
          this.liftForm.get('endPoint.municipality')?.enable()
        })
    }
  }

  onStartMunicipalityChange(event: any) {
    this.selectedStartMunicipality = event.target.value
    this.loadStartParishes()
  }

  loadStartParishes() {
    if (this.selectedStartMunicipality) {
      this.LiftService.getParishesByMunicipalities(
        this.selectedStartMunicipality
      )
        .pipe(
          catchError((err) => {
            this.toastr.error('Failed to load parishes', err?.error?.message)
            return of([])
          })
        )
        .subscribe((parishes: string[]) => {
          this.startParishes = parishes
          this.liftForm.get('startPoint.parish')?.enable()
        })
    }
  }

  onEndMunicipalityChange(event: any) {
    this.selectedEndMunicipality = event.target.value
    this.loadEndParishes()
  }

  loadEndParishes() {
    if (this.selectedEndMunicipality) {
      this.LiftService.getParishesByMunicipalities(this.selectedEndMunicipality)
        .pipe(
          catchError((err) => {
            this.toastr.error('Failed to load parishes', err?.error?.message)
            return of([])
          })
        )
        .subscribe((parishes: string[]) => {
          this.endParishes = parishes
          this.liftForm.get('endPoint.parish')?.enable()
        })
    }
  }

  openModal(): void {
    this.modalComponent.openModal()
  }

  toggleCreate(): void {
    this.currentModalTitle = 'Add lift'
    this.showCreateForm = true
    this.showApplicationForm = false
    this.showCancelStatus = false
    this.getCars()
    this.resetForm()
    this.openModal()
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

  toggleApplication(lift: Lift) {
    this.auxiliarLift = { ...lift }
    this.currentModalTitle = 'List of applications'
    this.showCreateForm = false
    this.showApplicationForm = true
    this.showCancelStatus = false
    this.openModal()
  }

  resetForm() {
    this.liftForm.reset()
  }

  confirmCreate(): void {
    const newLift: Lift = {
      driver: { username: this.clientUsername },
      car: {
        cc: this.liftForm.value.car!,
      },
      startPoint: {
        district: this.liftForm.value.startDistrict!,
        municipality: this.liftForm.value.startMunicipality!,
        parish: this.liftForm.value.startParish!,
      },
      endPoint: {
        district: this.liftForm.value.endDistrict!,
        municipality: this.liftForm.value.endMunicipality!,
        parish: this.liftForm.value.endParish!,
      },
      schedule: new Date(this.liftForm.value.schedule!),
      price: this.liftForm.value.price!,
      providedSeats: this.liftForm.value.providedSeats!,
    }
    this.LiftService.createLift(newLift).subscribe({
      next: () => {
        this.toastr.success('Lift created successfully.')
        this.cancel()
        this.getLiftsByUsername(this.clientUsername)
      },
      error: (err) => {
        this.toastr.error('Failed to create new lift.', err.error.error)
      },
    })
  }

  cancel(): void {
    this.modalComponent.closeModal()
    this.resetForm()
  }

  acceptApplication(ca: string): void {
    this.ApplicationService.acceptApplication(ca).subscribe({
      next: () => {
        this.toastr.success('Application accepted successfully.')
        this.cancel()
        this.getLiftsByUsername(this.clientUsername)
      },
      error: (err) => {
        this.toastr.error('Failed to accept application.', err.error.error)
      },
    })
  }

  rejectApplication(ca: string): void {
    this.ApplicationService.rejectApplication(ca).subscribe({
      next: () => {
        this.toastr.success('Application rejected successfully.')
        this.cancel()
        this.getLiftsByUsername(this.clientUsername)
      },
      error: (err) => {
        this.toastr.error('Failed to reject application.', err.error.error)
      },
    })
  }

  updateLiftFlags(lifts: Lift[]) {
    lifts.forEach((lift) => {
      this.liftFlags[lift.cl!] = lift.applications
        ? lift.applications.some(
            (app) => app.status === 'accepted' || app.status === 'ready'
          )
        : false
    })

    return this.liftFlags
  }

  toggleCancelStatus(lift: Lift, cl: string, status: string): void {
    this.auxiliarLift = { ...lift }
    this.currentModalTitle = 'Confirm Cancelation'
    this.currentLiftCode = cl
    this.newStatus = status
    this.showEditForm = false
    this.showDeleteForm = false
    this.showCreateForm = false
    this.showCancelStatus = true
    this.showApplicationForm = false
    this.resetForm()
    this.openModal()
  }

  updateCancelStatus(): void {
    this.LiftService.updateStatusLift(
      this.currentLiftCode,
      this.newStatus
    ).subscribe({
      next: () => {
        this.toastr.success('Updated lift status')
        this.cancel()
        this.getLiftsByUsername(this.clientUsername)
      },
      error: (err) => {
        this.toastr.error('Failed to update lift status', err.error.error)
      },
    })
  }

  isValidRating(rating: any): boolean {
    return !isNaN(rating) && rating >= 0 && rating <= 5
  }

  getStarsArray(rating: any): number[] {
    if (typeof rating === 'number' && !isNaN(rating)) {
      const wholeStars = Math.floor(rating)
      const hasPartialStar = rating % 1 !== 0
      return new Array(wholeStars).concat(hasPartialStar ? [0.5] : [])
    }
    return []
  }
}
