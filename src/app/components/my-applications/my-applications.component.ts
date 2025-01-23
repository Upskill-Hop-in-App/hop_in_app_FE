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
@Component({
  selector: 'app-my-applications',
  imports: [
    FormsModule,
    ModalComponent,
    AttachedIconPipe,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.css',
})
export class MyApplicationsComponent implements OnInit {
  clientUsername: string = ''
  applications: Application[] = []
  auxiliarApplication: Application = this.reset()
  currentModalTitle: string = ''
  showCancelForm: boolean = false
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
    scheduleDate: '',
    scheduleTime: '',
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
    this.getApplicationsByUsername(this.clientUsername)
  }
  
  /* ------------------------------- FILTER FUNCS -------------------------------- */
  
  clearFilters() {
    this.getApplicationsByUsername(this.clientUsername)
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
      scheduleDate: '',
      scheduleTime: '',
      driver: '',
      car: '',
    }
  }

  cleanFilters(filters: any): any {
    return Object.entries(filters)
      .filter(
        ([key, value]) => value !== '' && value !== null && value !== undefined
      )
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  }

  /* ------------------------------- AUTH FUNCS -------------------------------- */

  getUsername() {
    this.clientUsername = this.AuthService.getUserName()
  }

  /* ------------------------------- SERVICE FUNCS -------------------------------- */

  applyFilters() {
    const query = this.buildQueryString(this.cleanFilters(this.filters))
    console.log(query)
    this.ApplicationService.filterApplicationsByUsername(
      this.AuthService.getUserName(),
      query
    ).subscribe(
      (response) => {
        this.applications = response.data
        this.filtersApplied = true
      },
      (error) => {
        console.error(error)
        this.applications = []
        this.filtersApplied = true
      }
    )
  }

  getApplicationsByUsername(username: string): void {
    this.ApplicationService.getApplicationsByUsername(this.clientUsername)
      .pipe(
        catchError((err) => {
          this.toastr.info('No application found', err?.error?.message)
          return of([])
        })
      )
      .subscribe((data: Application[]) => {
        this.applications = data
      })
  }

  cancelApplication(): void {
    this.ApplicationService.cancelApplication(
      this.auxiliarApplication.ca!
    ).subscribe({
      next: () => {
        this.toastr.success('Application canceled successfully.')
        this.cancel()
        this.getApplicationsByUsername(this.clientUsername)
      },
      error: (err) => {
        this.toastr.error('Failed to cancel application.', err.error.error)
      },
    })
  }

  /* ------------------------------- MODAL FUNCS -------------------------------- */

  toggleCancel(application: Application) {
    this.auxiliarApplication = { ...application }
    this.currentModalTitle = 'Cancel application'
    this.showCancelForm = true
    this.openModal()
  }

  openModal(): void {
    this.modalComponent.openModal()
  }

  cancel(): void {
    this.modalComponent.closeModal()
  }

  /* ------------------------------- HELPER FUNCS -------------------------------- */

  buildQueryString(filters: Record<string, string | number | boolean>): string {
    return Object.entries(filters)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join('&')
  }

  reset(): Application {
    return {
      ca: '',
      passenger: { username: '', name: '', contact: '', email: '' },
      lift: {
        cl: '',
        driver: { name: '', username: '', contact: '', email: '' },
        car: {
          cc: '',
          plate: '',
          color: '',
          brand: '',
          model: '',
        },
        startPoint: { district: '', municipality: '', parish: '' },
        endPoint: { district: '', municipality: '', parish: '' },
        schedule: null,
        status: '',
      },
      status: '',
    }
  }
}
