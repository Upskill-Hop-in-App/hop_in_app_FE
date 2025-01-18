import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Lift } from '../../models/lift.model';
import { MyCar } from '../../models/my-car.model';
import { LiftService } from '../../services/lift.service';
import { FormsModule, Validators } from '@angular/forms';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { catchError, of } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';
import { DOCUMENT } from '@angular/common';
import { AttachedIconPipe } from '../../pipes/attached-icon.pipe';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

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
  lifts: Lift[] = [];
  cars: MyCar[] = [];
  startDistricts: string[] = [];
  startMunicipalities: string[] = [];
  startParishes: string[] = [];
  endDistricts: string[] = [];
  endMunicipalities: string[] = [];
  endParishes: string[] = [];
  selectedStartDistrict: string | null = null;
  selectedStartMunicipality: string | null = null;
  selectedEndDistrict: string | null = null;
  selectedEndMunicipality: string | null = null;
  // auxiliarLift: Lift = this.reset();
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  // backupLift: Lift = this.reset();
  showDeleteForm: boolean = false;
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
  });

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private LiftService: LiftService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getLifts();
    this.loadStartDistricts();
    this.loadEndDistricts();
    this.getCars();
  }

  getLifts(): void {
    this.LiftService.getLifts()
      .pipe(
        catchError((err) => {
          this.toastr.error('No lift found', err?.error?.message);
          return of([]);
        }),
      )
      .subscribe((data: Lift[]) => {
        this.lifts = data;
      });
  }

  getCars(): void {
    this.LiftService.getAllCars()
      .pipe(
        catchError((err) => {
          this.toastr.error('No car found', err?.error?.message);
          return of([]);
        }),
      )
      .subscribe((data: MyCar[]) => {
        this.cars = data;
      });
  }

  loadStartDistricts(): void {
    this.LiftService.getAllDistricts()
      .pipe(
        catchError((err) => {
          this.toastr.error('No district found', err?.error?.message);
          return of([]);
        }),
      )
      .subscribe((districts: string[]) => {
        this.startDistricts = districts;
      });
  }

  loadEndDistricts(): void {
    this.LiftService.getAllDistricts()
      .pipe(
        catchError((err) => {
          this.toastr.error('No district found', err?.error?.message);
          return of([]);
        }),
      )
      .subscribe((districts: string[]) => {
        this.endDistricts = districts;
      });
  }

  onStartDistrictChange(event: any) {
    this.selectedStartDistrict = event.target.value;
    this.loadStartMunicipalities();
  }

  loadStartMunicipalities(): void {
    if (this.selectedStartDistrict) {
      this.LiftService.getMunicipalitiesByDistrict(this.selectedStartDistrict)
        .pipe(
          catchError((err) => {
            this.toastr.error(
              'Failed to load municipalities',
              err?.error?.message,
            );
            return of([]);
          }),
        )
        .subscribe((municipalities: string[]) => {
          this.startMunicipalities = municipalities;
          this.liftForm.get('startPoint.municipality')?.enable();
        });
    }
  }

  onEndDistrictChange(event: any) {
    this.selectedEndDistrict = event.target.value;
    this.loadEndMunicipalities();
  }

  loadEndMunicipalities(): void {
    if (this.selectedEndDistrict) {
      this.LiftService.getMunicipalitiesByDistrict(this.selectedEndDistrict)
        .pipe(
          catchError((err) => {
            this.toastr.error(
              'Failed to load municipalities',
              err?.error?.message,
            );
            return of([]);
          }),
        )
        .subscribe((municipalities: string[]) => {
          this.endMunicipalities = municipalities;
          this.liftForm.get('endPoint.municipality')?.enable();
        });
    }
  }

  onStartMunicipalityChange(event: any) {
    this.selectedStartMunicipality = event.target.value;
    this.loadStartParishes();
  }

  loadStartParishes() {
    if (this.selectedStartMunicipality) {
      this.LiftService.getParishesByMunicipalities(
        this.selectedStartMunicipality,
      )
        .pipe(
          catchError((err) => {
            this.toastr.error('Failed to load parishes', err?.error?.message);
            return of([]);
          }),
        )
        .subscribe((parishes: string[]) => {
          this.startParishes = parishes;
          this.liftForm.get('startPoint.parish')?.enable();
        });
    }
  }

  onEndMunicipalityChange(event: any) {
    this.selectedEndMunicipality = event.target.value;
    this.loadEndParishes();
  }

  loadEndParishes() {
    if (this.selectedEndMunicipality) {
      this.LiftService.getParishesByMunicipalities(this.selectedEndMunicipality)
        .pipe(
          catchError((err) => {
            this.toastr.error('Failed to load parishes', err?.error?.message);
            return of([]);
          }),
        )
        .subscribe((parishes: string[]) => {
          this.endParishes = parishes;
          this.liftForm.get('endPoint.parish')?.enable();
        });
    }
  }

  openModal(): void {
    this.modalComponent.openModal();
  }

  toggleCreate(): void {
    this.showEditForm = false;
    this.showDeleteForm = false;
    this.showCreateForm = true;
    this.resetForm();
    this.openModal();
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

  resetForm() {
    this.liftForm.reset();
  }

  confirmCreate(): void {
    const formValues = this.liftForm.value;

    const newLift: Lift = {
      driver: { username: this.liftForm.value.driver! },
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
      schedule: new Date(formValues.schedule ?? ''),
      price: this.liftForm.value.price!,
      providedSeats: this.liftForm.value.providedSeats!,
    };
    this.LiftService.createLift(newLift).subscribe({
      next: () => {
        this.toastr.success('Lift created successfully.');
        this.cancel();
        this.getLifts();
      },
      error: (err) => {
        this.toastr.error('Failed to create new lift.', err.error.error);
      },
    });
  }

  cancel(): void {
    this.modalComponent.closeModal();
    this.resetForm();
  }

  // toggleEdit(booking: Booking) {
  //   this.showCreateForm = false;
  //   this.showDeleteForm = false;
  //   this.backupBooking = { ...booking };
  //   this.bookingForm.setValue({
  //     customer: booking.customer.email!,
  //     tourPack: booking.tourPack.ct,
  //     date: booking.date!.toString(),
  //   });
  //   this.showEditForm = true;
  //   this.openModal();
  // }

  // confirmEdit(): void {
  //   this.auxiliarBooking.customer.email = this.bookingForm.value.customer!;
  //   this.auxiliarBooking.tourPack.ct = this.bookingForm.value.tourPack!;
  //   this.auxiliarBooking.date = new Date(this.bookingForm.value.date!);

  //   this.BookingService.updateBooking(
  //     this.backupBooking,
  //     this.auxiliarBooking,
  //   ).subscribe({
  //     next: () => {
  //       this.toastr.success('Booking updated successfully.');
  //       this.cancel();
  //       this.getBookings();
  //     },
  //     error: (err) => {
  //       this.toastr.error(
  //         'Failed to update booking.',
  //         err.error.message ? err.error.message : err.error.error,
  //       );
  //     },
  //   });
  // }

  // toggleDelete(booking: Booking): void {
  //   this.confirmationEmail = '';
  //   this.showCreateForm = false;
  //   this.showEditForm = false;
  //   this.showDeleteForm = true;
  //   this.auxiliarBooking = { ...booking };
  //   this.openModal();
  // }

  // confirmDelete(): void {
  //   if (this.confirmationEmail === this.auxiliarBooking.customer.email) {
  //     this.BookingService.deleteBooking(this.auxiliarBooking).subscribe({
  //       next: () => {
  //         this.toastr.success('Booking deleted successfully.');
  //         this.cancel();
  //         this.getBookings();
  //       },
  //       error: (err) => {
  //         this.toastr.error('Failed to delete booking.', err.error.error);
  //       },
  //     });
  //   } else {
  //     console.error('Confirmation code does not match');
  //   }
  // }

  // showFilterParameters(): void {
  //   const filter = this.document.getElementById('filters');
  //   if (filter) {
  //     if (filter.classList.contains('invisible')) {
  //       filter.classList.remove('invisible', 'w-0');
  //       filter.classList.add('visible', 'w-full');
  //     } else {
  //       filter.classList.remove('visible', 'w-full');
  //       filter.classList.add('invisible', 'w-0');
  //     }
  //   }
  // }

  // filterBooking(): void {
  //   if (this.selectedFilter === 'code') {
  //     this.BookingService.getBookingByCode(this.inputFilter).subscribe(
  //       (data: { message: string; data: Booking }) => {
  //         this.bookings = [];
  //         this.bookings.push(data.data);
  //       },
  //       (err: any) => {
  //         this.toastr.info(
  //           'Failed to fetch bookings by code.',
  //           err?.error?.error,
  //         );
  //       },
  //     );
  //   }
  //   if (this.selectedFilter === 'email') {
  //     this.BookingService.getBookingByEmail(this.inputFilter).subscribe(
  //       (data: { message: string; data: Booking[] }) => {
  //         this.bookings = data.data;
  //       },
  //       (err: any) => {
  //         this.toastr.info(
  //           'Failed to fetch booking by email.',
  //           err?.error?.error,
  //         );
  //       },
  //     );
  //   }
  // }
}
