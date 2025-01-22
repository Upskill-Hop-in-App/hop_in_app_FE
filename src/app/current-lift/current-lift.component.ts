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
  imports: [RouterLink, FormsModule, ReactiveFormsModule, AttachedIconPipe, ModalComponent],
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
  currentModalTitle: string = "";
  userRole: string | null = "";
  user: string | null = "";

  ratingsForm: FormGroup;

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(
    private LiftService: LiftService,
    private ApplicationService: ApplicationService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.ratingsForm = new FormGroup({});
  }

  ngOnInit() {
    this.userRole = this.authService.getUserRole()
    this.user = this.authService.getUserName()
    this.ratingsForm = this.createRatingsForm();
    this.route.queryParamMap.subscribe((params) => {
      this.liftCode = params.get('lift');
    });
    if (this.liftCode) {
      this.getLiftByCode(`cl=${this.liftCode}`, this.user);
    } else {
      this.getLiftInProgress(`driver=${this.user}`)
      this.toastr.error('Invalid lift code');
    }
    /* this.router.events.subscribe((event) => {
      if (this.router.url === '/lifts') {
        this.resetView();
      }
    }); */
  }

  getLiftByCode(query:string, role: string): void {
    this.LiftService.filterLift(query, this.user!)
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
        console.log(this.lift);
      });
  }

  getLiftInProgress(query:string): void {
    this.LiftService.filterLift(query, this.user!)
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
        this.lifts = response.data;
        this.lifts.filter((lift) => (lift.status !== "open" && lift.status !== "ready"))
        this.lift = this.lifts[0]
        this.ratingsForm = this.createRatingsForm();
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

      },
      error: (err) => {
        this.toastr.error('Failed to start lift', err.error.message);
      },
    });
  }

  toggleRatingModal(): void {
    this.currentModalTitle = "Rate Passengers (1-5)";
    this.showRatingModal = true;
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
        this.ApplicationService.updatePassengerRating(passengerCa, passengerRating).subscribe({
          next: () => {
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

  /* resetView() {
    this.liftCode = null;
  } */
}
