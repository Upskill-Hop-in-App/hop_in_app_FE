import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Lift } from '../../models/lift.model';
import { LiftService } from '../../services/lift.service';
import { FormsModule, Validators } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  of,
} from 'rxjs';
// import { ModalComponent } from '../modal/modal.component';
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
    // ModalComponent,
    AttachedIconPipe,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './lift.component.html',
  styleUrl: './lift.component.css',
})
export class LiftComponent implements OnInit {
  lifts: Lift[] = [];
  // auxiliarLift: Lift = this.reset();
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  // backupLift: Lift = this.reset();
  showDeleteForm: boolean = false;
  liftForm = new FormGroup({
    customer: new FormControl('', [Validators.required]),
    tourPack: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });
  confirmationEmail: string = '';
  selectedFilter: string = 'all';
  inputFilter: string = '';
  userRole: string | null = '';
  userLog: string | null = '';
  userEmail: string = '';
  message: { text: string; type: string } | null = null;
  tourPack: string | null = null;

  // @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private LiftService: LiftService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getLifts();
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

  // openModal(): void {
  //   this.modalComponent.openModal();
  // }

  // toggleCreate(): void {
  //   this.showEditForm = false;
  //   this.showDeleteForm = false;
  //   this.showCreateForm = true;
  //   this.resetForm();
  //   this.openModal();
  // }

  // reset(): Booking {
  //   return {
  //     _id: '',
  //     cb: '',
  //     customer: { email: '', name: '' },
  //     tourPack: {
  //       ct: '',
  //       category: '',
  //       destination: {
  //         cd: '',
  //         name: '',
  //         country: '',
  //       },
  //     },
  //     date: null,
  //     createdAt: '',
  //     updatedAt: '',
  //     __v: '',
  //   };
  // }

  // resetForm() {
  //   this.bookingForm.reset();
  // }

  // confirmCreate(): void {
  //   const newBooking: Booking = {
  //     customer: { email: this.bookingForm.value.customer! },
  //     tourPack: { ct: this.bookingForm.value.tourPack! },
  //     date: new Date(this.bookingForm.value.date!),
  //   };
  //   this.BookingService.createBooking(newBooking).subscribe({
  //     next: () => {
  //       this.toastr.success('Booking added successfully.');
  //       this.cancel();
  //       if (this.userRole === 'client') {
  //         this.BookingService.getBookingByEmail(this.userEmail).subscribe(
  //           (data: { message: string; data: Booking[] }) => {
  //             this.bookings = data.data;
  //           },
  //         );
  //       } else {
  //         this.getBookings();
  //       }
  //     },
  //     error: (err) => {
  //       this.toastr.error('Failed to add new booking.', err.error.error);
  //     },
  //   });
  // }

  // cancel(): void {
  //   this.modalComponent.closeModal();
  //   this.resetForm();
  //   this.confirmationEmail = '';
  //   this.tourPack = null;
  // }

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