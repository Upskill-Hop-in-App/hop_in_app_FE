// import { Component } from '@angular/core';
// import { FormsModule, Validators } from '@angular/forms';
// import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { Router } from '@angular/router';
// import { jwtDecode } from 'jwt-decode';
// import { CommonModule } from '@angular/common';
// import {
//   FontAwesomeModule,
//   FaIconLibrary,
// } from '@fortawesome/angular-fontawesome';

// //import { AuthService } from '../../services/auth.service';
// //import { UserLogin } from '../../models/user.model';

// @Component({
//   selector: 'app-login',
//   imports: [FormsModule, ReactiveFormsModule, CommonModule],
//   standalone: true,
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css',
// })
// export class LoginComponent {
//   loginForm = new FormGroup({
//     username: new FormControl('', [Validators.required]),
//     password: new FormControl('', [Validators.required]),
//   });

//   constructor(
//     //private authService: AuthService,
//     private router: Router,
//     private toastr: ToastrService,
//   ) {}

//   login(): void {
//     const user: UserLogin = {
//       username: this.loginForm.value.username!,
//       password: this.loginForm.value.password!,
//     };

//     //this.authService.login(user).subscribe({
//       next: (response: any) => {
//     //     if (response.userToken) {
//     //       localStorage.setItem('userToken', response.userToken);
//     //       localStorage.setItem(
//     //         'decodedUser',
//     //         JSON.stringify(jwtDecode(response.userToken)),
//     //       );

//     //       this.loginForm.setValue({ username: '', password: '' });

//     //       this.toastr.success('Welcome back', 'Login successfully');

//     //       this.router.navigate(['/']);
//     //     } else {
//     //       this.toastr.error('Failed to login');
//     //     }
//     //   },
//       error: (err) => {
//         this.toastr.error('Error: ' + (err.error?.error || 'Unknown error'));
//       },
//     });
//   }
// }
