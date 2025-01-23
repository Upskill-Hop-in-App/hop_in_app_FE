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

  getUsername() {
    this.clientUsername = this.AuthService.getUserName()
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

  toggleCancel(application: Application) {
    this.auxiliarApplication = { ...application }
    this.currentModalTitle = 'Cancel application'
    this.showCancelForm = true
    this.openModal()
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

  openModal(): void {
    this.modalComponent.openModal()
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

  cancel(): void {
    this.modalComponent.closeModal()
  }

  isValidRating(rating: any): boolean {
    return !isNaN(rating) && rating >= 0 && rating <= 5
  }

  getStarsArray(rating: any): number[] {
    if (typeof rating === 'number' && !isNaN(rating)) {
      const wholeStars = Math.floor(rating) // Integer part
      const hasPartialStar = rating % 1 !== 0 // Check if it's a float
      return new Array(wholeStars).concat(hasPartialStar ? [0.5] : []) // Add partial star if necessary
    }
    return [] // Return empty array for invalid ratings
  }
}
