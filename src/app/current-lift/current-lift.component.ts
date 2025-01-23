import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { LiftService } from '../services/lift.service';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../components/modal/modal.component';
import { AttachedIconPipe } from '../pipes/attached-icon.pipe';
import { catchError, Observable, of } from 'rxjs';
import { Lift } from '../models/lift.model';
import {
  RouterLink,
  Router,
  ActivatedRoute,
  QueryParamsHandling,
} from '@angular/router';
import {
  FormControl,
  FormControlName,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-current-lift',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    AttachedIconPipe,
    ModalComponent,
  ],
  templateUrl: './current-lift.component.html',
  styleUrl: './current-lift.component.css',
})
export class CurrentLiftComponent implements OnInit {
  lift: Lift = this.reset();
  lifts: Lift[] = [];
  liftCode: string | null = null;
  clientUsername: string = 'admin';
  liftStarted: boolean = false;
  liftFinished: boolean = false;
  liftClosed: boolean = false;
  showRatingModal: boolean = false;
  showDriverRatingModal: boolean = false;
  currentModalTitle: string = '';
  userRole: string | null = '';
  user: string | null = '';
  isDriver: boolean = false;
  isPassenger: boolean = false;
  driverSubmited: boolean = false;
  passengerSubmited: boolean = false;
  role: string = '';
  noLifts: boolean = false;
  auxiliarLift: Lift = this.reset();
  ratingsForm: FormGroup;
  driverRatingForm = new FormGroup({
    rating: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
  });

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(
    private LiftService: LiftService,
    private ApplicationService: ApplicationService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.ratingsForm = new FormGroup({});
  }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.user = this.authService.getUserName();
    this.ratingsForm = this.createRatingsForm();
    this.route.queryParamMap.subscribe((params) => {
      this.liftCode = params.get('lift');
    });
    if (this.liftCode) {
      this.getLiftByCode(`cl=${this.liftCode}`, this.user);
      
      console.log(this.liftCode);
    } else {
      this.getLiftInProgress(``, this.user);
    }
  }

  getLiftByCode(query: string, role: string): void {
    this.LiftService.filterLifts(query)
      .pipe(
        catchError((err) => {
          this.toastr.error(
            'No lift found',
            err?.error?.message || 'Error fetching lift',
          );
          return of({ message: '', data: [] });
        }),
      )
      .subscribe((response: { message: string; data: Lift[] }) => {
        this.lift = response.data[0] || null;
        this.ratingsForm = this.createRatingsForm();
      });
  }

  getLiftInProgress(query: string, user: string): void {
    this.LiftService.filterLifts(query)
      .pipe(
        catchError((err) => {
          this.toastr.error(
            'No lift found',
            err?.error?.message || 'Error fetching lift',
          );
          return of({ message: '', data: [] });
        }),
      )
      .subscribe((response: { message: string; data: Lift[] }) => {
        this.isDriver = false;
        this.isPassenger = false;
        this.lifts = response.data.filter(
          (lift) =>
            lift.status !== 'open' &&
            lift.status !== 'ready' &&
            lift.status !== 'closed' &&
            lift.status !== 'canceled',
        );

        this.lifts = this.lifts.filter(
          (lift) =>
            lift.driver.username === user ||
            lift.applications?.some((app) => app.passenger?.username === user),
        );

        this.LiftService.getRole(user).subscribe((response: string) => {
          this.role = response;
          console.log(this.role);
        });
        this.isDriver = this.lifts.some(
          (lift) => lift.driver.username === user,
        );
        this.isPassenger = this.lifts.some((lift) =>
          lift.applications?.some((app) => app.passenger?.username === user),
        );
        this.lift = this.lifts[0];

        if (this.lift && this.lift.status === 'finished' && this.isDriver) {
          this.driverSubmited = this.lift.applications!.every(
            (app) =>
              app.status === 'ready' &&
              app.receivedPassengerRating &&
              app.receivedPassengerRating > 0,
          );
        }
        this.ratingsForm = this.createRatingsForm();
      });
  }

  getClosedLift(query: string, user: string): void {
    this.LiftService.filterLifts(query)
      .pipe(
        catchError((err) => {
          this.toastr.error(
            'No lift found',
            err?.error?.message || 'Error fetching lift',
          );
          return of({ message: '', data: [] });
        }),
      )
      .subscribe((response: { message: string; data: Lift[] }) => {
        this.isDriver = false;
        this.isPassenger = false;
        this.lifts = response.data.filter(
          (lift) =>
            lift.status !== 'open' &&
            lift.status !== 'ready' &&
            lift.status !== 'canceled',
        );
        this.lifts = this.lifts.filter(
          (lift) =>
            lift.driver.username === user ||
            lift.applications?.some((app) => app.passenger?.username === user),
        );
        this.lift = this.lifts[0];
      });
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
    };
  }

  openModal(): void {
    this.modalComponent.openModal();
  }

  resetForm() {
    this.ratingsForm.reset();
  }

  readyApplication(ca: string): void {
    this.ApplicationService.readyApplication(ca).subscribe({
      next: () => {
        this.toastr.success('Application status updated');
        const app = this.lift.applications?.find((a) => a.ca === ca);
        if (app) {
          app.status = 'ready';
        }
      },
      error: (err) => {
        this.toastr.error('Failed to update application status', err.message);
      },
    });
  }

  getOccupiedSeats(): number {
    return (
      this.lift.applications?.filter((app) => app.status === 'ready').length ||
      0
    );
  }

  startLift(): void {
    this.LiftService.updateStatusLift(this.lift.cl!, 'inProgress').subscribe({
      next: () => {
        this.toastr.success('Lift started successfully');
        this.liftStarted = true;
        this.router.events.subscribe((event) => {
          if (this.router.url === '/current-lift') {
            this.resetView();
          }
        });
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { lift: null },
          queryParamsHandling: 'merge', // Keeps other query params, if any
        });
       
          this.getLiftInProgress(``, this.user!);
      },
      error: (err) => {
        this.toastr.error('Failed to start lift', err.error.message);
      },
    });
  }

  finishLift(): void {
    this.LiftService.updateStatusLift(this.lift.cl!, 'finished').subscribe({
      next: () => {
        this.toastr.success('Lift started successfully');
        this.liftStarted = false;
        this.liftFinished = true;
        this.liftClosed = false;
        this.getLiftInProgress(``, this.user!);
      },
      error: (err) => {
        this.toastr.error('Failed to start lift', err.error.message);
      },
    });
  }

  closeLift(): void {
    this.LiftService.updateStatusLift(this.lift.cl!, 'closed').subscribe({
      next: () => {
        this.toastr.success('Lift started successfully');
        this.liftStarted = false;
        this.liftFinished = false;
        this.liftClosed = true;
        this.getClosedLift(``, this.user!);
      },
      error: (err) => {
        this.toastr.error('Failed to start lift', err.error.message);
      },
    });
  }

  toggleRatingModal(lift?: Lift): void {
    this.currentModalTitle = 'Ratings (1-5)';
    if (lift) {
      this.auxiliarLift = { ...lift };
    }
    this.showRatingModal = true;
    console.log(
      this.liftFinished,
      this.liftStarted,
      this.liftClosed,
      this.liftCode,
    );
    this.resetForm();
    this.openModal();
  }

  cancel(): void {
    this.modalComponent.closeModal();
    this.resetForm();
  }

  createRatingsForm(): FormGroup {
    const formControls: { [key: string]: FormControl } = {};
    this.lift.applications?.forEach((app) => {
      if (app.status === 'ready') {
        formControls[app.ca!] = new FormControl(null, [
          Validators.required,
          Validators.min(1),
          Validators.max(5),
        ]);
      }
    });
    return new FormGroup(formControls);
  }

  submitRatings(): void {
    if (this.ratingsForm.valid) {
      Object.entries(this.ratingsForm.value).forEach(([ca, rating]) => {
        const passengerCa = ca as string;
        const passengerRating = rating as number;
        this.ApplicationService.updatePassengerRating(
          passengerCa,
          passengerRating,
        ).subscribe({
          next: () => {
            this.driverSubmited = true;
            this.cancel();
            this.toastr.success('Ratings submitted successfully');
          },
          error: (err) => {
            this.toastr.error('Failed to submit ratings', err.error.message);
          },
        });
      });
    } else {
      this.toastr.error('Please fill in all ratings between 1 and 5');
    }
  }

  submitDriverRating(): void {
    if (this.driverRatingForm.valid) {
      let cl = this.auxiliarLift.cl;
      let rating = this.driverRatingForm.value.rating;
      this.LiftService.updateDriverRating(cl!, rating!).subscribe({
        next: () => {
          this.passengerSubmited = true;
          this.cancel();
          this.toastr.success('Ratings submitted successfully');
        },
        error: (err) => {
          this.toastr.error('Failed to submit ratings', err.error.message);
        },
      });
    } else {
      this.toastr.error('Please fill in all ratings between 1 and 5');
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  resetView() {
    this.liftCode = null;
  }
}
