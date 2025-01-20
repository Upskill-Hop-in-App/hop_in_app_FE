// import { Component } from "@angular/core";
// import { Router } from "@angular/router";
// import { FormBuilder, Validators } from "@angular/forms";
// import { ToastrService } from "ngx-toastr";
// import { Observable } from "rxjs";
// import { ModalService } from "../../services/modal.service";
// import { LoginService } from "../../services/login.service";
// import { GeoApiService } from "../../services/geoapi.service";
// //import { environment } from "../../../environments/environment";
// import { Lift } from "../../models/lift.model";
// import { MyCar } from "../../models/my-car.model";

// @Component({
//   selector: "app-home",
//   templateUrl: "./home.component.html",
//   styleUrls: ["./home.component.css"],
// })

// export class HomeComponent {
//   public lifts: Lift[] = [];
//   public cars: MyCar[] = [];
//   public liftForm = this.fb.group({
//     origin: ["", Validators.required],
//     destination: ["", Validators.required],
//     date: ["", Validators.required],
//     time: ["", Validators.required],
//     car: ["", Validators.required],
//   });

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private modalService: ModalService,
//     private loginService: LoginService,
//     private geoApiService: GeoApiService,
//     private toastr: ToastrService
//   ) {}

//   ngOnInit(): void {
//     this.getLifts();
//     this.getCars();
//   }

//   getLifts(): void {
//     this.loginService.getLifts().subscribe({
//       next: (response: any) => {
//         this.lifts = response;
//       },
//       error: (err) => {
//         this.toastr.error("Error: " + (err.error?.error || "Unknown error"));
//       },
//     });
//   }

//   getCars(): void {
//     this.loginService.getCars().subscribe({
//       next: (response: any) => {
//         this.cars = response;
//       },
//       error: (err) => {
//         this.toastr.error("Error: " + (err.error?.error || "Unknown error"));
//       },
//     });
//   }

//   openModal(): void {
//     this.modalService.openModal().subscribe({
//       next: () => {
//         this.getLifts();
//       },
//     });
//   }

//   searchLift(): void {
//     const origin = this.liftForm.value.origin;
//     const destination = this.liftForm.value.destination;
//     const date = this.liftForm.value.date;
//     const time = this.liftForm.value.time;
//     const car = this.liftForm.value.car;

//     this.geoApiService
//       .getDistance(origin, destination, environment.geoApiKey)
//       .subscribe({
//         next: (response: any) => {
//           const distance = response.rows[0].elements[0].distance.text;
//           const duration = response.rows[0].elements[0].duration.text;

//           const lift: Lift = {
//             origin: origin,
//             destination: destination,
//             date: date,
//             time: time,
//             distance: distance,
//             duration: duration,
//             car: car,
//           };

//           this.loginService.searchLift(lift).subscribe({
//             next: (response: any) => {
//               this