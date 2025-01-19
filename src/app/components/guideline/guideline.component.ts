// //import { AuthService } from './../../services/auth.service';
// import { catchError } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { ToastrService } from 'ngx-toastr';
// import { Component, Inject, OnInit, ViewChild } from '@angular/core';
// //import { Guideline } from '../../models/guideline.model';
// import { AppModalComponent } from '../modal/modal.component';
// //import { GuidelineService } from '../../services/guideline.service';
// //import { CommonModule, DOCUMENT } from '@angular/common';
// //import { Message, MessageService } from '../../services/message.service';
// import { FormsModule, Validators } from '@angular/forms';
// import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// //import { MessageComponent } from '../message/message.component';
// //import { Outbreak } from '../../models/outbreak.model';
// import { RouterLink } from '@angular/router';
// import { QueryParamsHandling } from '@angular/router';
// import {
//   faMagnifyingGlass,
//   faFilterCircleXmark,
//   faPlus,
//   faHome,
//   faPenToSquare as faPenToSquareSolid,
//   faTrashCan as faTrashCanSolid,
// } from '@fortawesome/free-solid-svg-icons';
// import {
//   faPenToSquare,
//   faTrashCan as faTrashCanRegular,
// } from '@fortawesome/free-regular-svg-icons';
// import {
//   FontAwesomeModule,
//   FaIconLibrary,
// } from '@fortawesome/angular-fontawesome';

// @Component({
//   selector: 'app-guideline',
//   imports: [
//     FormsModule,
//     AppModalComponent,
//     // CommonModule,
//     ReactiveFormsModule,
//     // MessageComponent,
//     RouterLink,
//     FontAwesomeModule,
//   ],
//   templateUrl: './guideline.component.html',
//   styleUrl: './guideline.component.css',
// })
// export class GuidelineComponent implements OnInit {
//   // guidelines: Guideline[] = [];
//   title: string = 'Guidelines';
//   guidelineForm = new FormGroup({
//     cg: new FormControl('', [Validators.required]),
//     outbreak: new FormControl('', [Validators.required]),
//     message: new FormControl('', [Validators.required]),
//     validityPeriod: new FormControl<number | null>(null, [Validators.required]),
//     confirmationCg: new FormControl(''),
//   });
//   selectedGuideline: Guideline = this.reset();
//   showCreateForm: boolean = false;
//   showMessageModal: boolean = false;
//   newGuideline: Guideline = this.reset();
//   showEditForm: boolean = false;
//   backupGuideline: Guideline = this.reset();
//   editGuidelineModal: any;
//   showDeleteForm: boolean = false;
//   deleteGuidelineModal: any;
//   confirmationCg: string = '';
//   selectedFilter: string = 'all';
//   inputFilter: string = '';
//   curentModalTitle: string = '';
//   inputFilterCountry: string = '';
//   inputFilterVirus: string = '';
//   message: Message | null = null;
//   outbreaks: Outbreak[] = [];

//   @ViewChild(AppModalComponent) modalComponent!: AppModalComponent;
//   @ViewChild('filterSelect') filterSelect!: HTMLSelectElement;

//   constructor(
//     private guidelineService: GuidelineService,
//     private authService: AuthService,
//     private toastr: ToastrService,
//     @Inject(DOCUMENT) private document: Document,
//     private messageService: MessageService,
//     library: FaIconLibrary,
//   ) {
//     library.addIcons(
//       faHome,
//       faMagnifyingGlass,
//       faFilterCircleXmark,
//       faPlus,
//       faPenToSquare,
//       faTrashCanRegular,
//       faPenToSquareSolid,
//       faTrashCanSolid,
//     );
//   }

//   ngOnInit(): void {
//     this.getGuidelines();
//     this.messageService.currentMessage$.subscribe((msg) => {
//       this.message = msg;
//     });
//   }

//   isAdminAuth(): boolean {
//     return this.authService.isAdminAuth();
//   }

//   isEmployeeAuth(): boolean {
//     return this.authService.isEmployeeAuth();
//   }

//   openModal(): void {
//     this.modalComponent.openModal();
//   }

//   openCreateModal(): void {
//     this.curentModalTitle = 'Add Guideline';
//     this.showCreateForm = true;
//     this.showEditForm = false;
//     this.showDeleteForm = false;
//     this.showMessageModal= false;
//     this.resetForm();
//     this.openModal();
//   }

//   openEditModal(guideline: Guideline): void {
//     this.curentModalTitle = 'Edit Guideline';
//     this.backupGuideline = { ...guideline };
//     this.selectedGuideline = { ...guideline };
//     this.showEditForm = true;
//     this.showCreateForm = false;
//     this.showDeleteForm = false;
//     this.showMessageModal= false;
//     this.guidelineForm.setValue({
//       cg: guideline.cg!,
//       outbreak: guideline.outbreak,
//       message: guideline.message,
//       validityPeriod: guideline.validityPeriod ?? null,
//       confirmationCg: '',
//     });
//     this.openModal();
//   }

//   openDeleteModal(guideline: Guideline): void {
//     this.curentModalTitle = 'Delete Guideline';
//     this.confirmationCg = '';
//     this.backupGuideline = { ...guideline };
//     this.selectedGuideline = { ...guideline };
//     this.guidelineForm.setValue({
//       cg: guideline.cg!,
//       outbreak: guideline.outbreak,
//       message: guideline.message,
//       validityPeriod: guideline.validityPeriod ?? null,
//       confirmationCg: '',
//     });
//     this.showEditForm = false;
//     this.showCreateForm = false;
//     this.showMessageModal= false;
//     this.showDeleteForm = true;
//     this.openModal();
//   }

//   openMessageModal(guideline: Guideline): void {
//     this.backupGuideline = { ...guideline };
//     this.curentModalTitle = `${this.backupGuideline.cg} - Safety Recommendations`;
//     this.confirmationCg = '';
//     this.showEditForm = false;
//     this.showCreateForm = false;
//     this.showDeleteForm = false;
//     this.showMessageModal = true;
//     this.openModal();
//   }

//   confirmAdd(): void {
//     const newGuideline: Guideline = {
//       cg: this.guidelineForm.value.cg!,
//       outbreak: this.guidelineForm.value.outbreak!,
//       message: this.guidelineForm.value.message!,
//       validityPeriod: this.guidelineForm.value.validityPeriod!,
//     };
//     this.guidelineService.createGuideline(newGuideline).subscribe({
//       next: () => {
//         this.toastr.success('Guideline added successfully.');
//         this.getGuidelines();
//         this.cancel();
//       },
//       error: (err) => {
//         this.toastr.error('Failed to add new guideline.', err.error.error);
//       },
//     });
//   }

//   confirmEdit(): void {
//     this.selectedGuideline.cg = this.guidelineForm.value.cg!;
//     this.selectedGuideline.outbreak = this.guidelineForm.value.outbreak!;
//     this.selectedGuideline.message = this.guidelineForm.value.message!;
//     this.selectedGuideline.validityPeriod =
//       this.guidelineForm.value.validityPeriod!;
//     this.guidelineService
//       .updateGuidelineByCode(this.backupGuideline, this.selectedGuideline)
//       .subscribe({
//         next: () => {
//           this.toastr.success('Guideline updated successfully.');
//           this.selectedGuideline = this.reset();
//           this.backupGuideline = this.reset();
//           this.getGuidelines();
//           this.cancel();
//         },
//         error: (err) => {
//           this.toastr.error('Failed to update guideline.', err.error.error);
//         },
//       });
//   }

//   confirmDelete(): void {
//     if (
//       this.guidelineForm.value.confirmationCg?.toUpperCase() !==
//       this.selectedGuideline.cg?.toUpperCase()
//     ) {
//       this.toastr.error(
//         `The confirmation code does not match the guideline code. ${this.guidelineForm.value.confirmationCg} - ${this.selectedGuideline.cg} `,
//       );
//       return;
//     }

//     this.guidelineService
//       .deleteGuidelineByCode(this.selectedGuideline.cg!)
//       .subscribe({
//         next: () => {
//           this.toastr.success('Guideline deleted successfully');
//           this.cancel();
//           this.getGuidelines();
//         },
//         error: (err) => {
//           this.toastr.error(err.error.error, 'Failed to delete guideline');
//           this.getGuidelines();
//         },
//       });
//   }

//   cancel(): void {
//     this.modalComponent.closeModal();
//     this.newGuideline = this.reset();
//     this.selectedGuideline = this.reset();
//   }

//   reset(): Guideline {
//     return {
//       _id: '',
//       cg: '',
//       outbreak: '',
//       message: '',
//       validityPeriod: null,
//       isExpired: false,
//       createdAt: '',
//       updatedAt: '',
//     };
//   }

//   resetForm() {
//     this.guidelineForm.reset();
//   }

//   getGuidelines(): void {
//     this.guidelineService
//       .getGuidelines()
//       .pipe(
//         catchError((err) => {
//           this.toastr.error('Failed to fetch guidelines.', err?.error?.error);
//           return of([]);
//         }),
//       )
//       .subscribe((data: Guideline[]) => {
//         this.guidelines = data;
//       });
//   }

//   showFilterParameters(): void {
//     const filter = this.document.getElementById('filters');
//     if (filter) {
//       if (filter.classList.contains('invisible')) {
//         filter.classList.remove('invisible', 'w-0');
//         filter.classList.add('visible', 'w-full');
//       } else {
//         filter.classList.remove('visible', 'w-full');
//         filter.classList.add('invisible', 'w-0');
//       }
//     }
//   }

//   filterGuideline(): void {
//     if (this.selectedFilter === 'code') {
//       this.guidelineService.getGuidelineByCode(this.inputFilter).subscribe(
//         (data: { message: string; data: Guideline }) => {
//           this.guidelines = [];
//           this.guidelines.push(data.data);
//         },
//         (err: any) => {
//           this.toastr.info(
//             'Failed to fetch guideline by code.',
//             err?.error?.error,
//           );
//         },
//       );
//     }
//     if (this.selectedFilter === 'status') {
//       var status: boolean = false;
//       if (this.inputFilter === 'true') {
//         status = true;
//       } else if (this.inputFilter === 'false') {
//         status = false;
//       }
//       this.guidelineService.getGuidelineByStatus(status).subscribe(
//         (data: { message: string; data: Guideline[] }) => {
//           this.guidelines = data.data;
//         },
//         (err: any) => {
//           this.toastr.info(
//             'Failed to fetch guideline by status.',
//             err?.error?.error,
//           );
//         },
//       );
//     }
//     if (this.selectedFilter === 'countryAndVirus') {
//       this.guidelineService
//         .getGuidelineByCountryAndVirus(
//           this.inputFilterCountry,
//           this.inputFilterVirus,
//         )
//         .subscribe(
//           (data: { message: string; data: Guideline[] }) => {
//             this.guidelines = data.data;
//           },
//           (err: any) => {
//             this.toastr.info(
//               'Failed to fetch guideline by country and virus codes.',
//               err?.error?.error,
//             );
//           },
//         );
//     }
//     if (this.selectedFilter === 'all') {
//       this.getGuidelines();
//       return;
//     }
//   }

//   resetFilter(): void {
//     this.selectedFilter = 'all';
//     this.inputFilter = '';

//     if (this.filterSelect) {
//       this.filterSelect.value = '';
//     }

//     this.filterGuideline();
//   }
// }
