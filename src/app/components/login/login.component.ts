import { Component } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { UserLogin } from '../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  login(): void {
    if (this.loginForm.invalid) {
      const controls = this.loginForm.controls;

      if (controls['email'].invalid) {
        if (controls['email'].errors?.['required']) {
          this.toastr.error('Email is required', 'Validation Error');
        } else if (controls['email'].errors?.['email']) {
          this.toastr.error('Enter a valid email address', 'Validation Error');
        }
      }

      if (controls['password'].errors?.['required']) {
        this.toastr.error('Password is required', 'Validation Error');
      }
      return;
    }

    const user: UserLogin = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };

    this.authService.login(user).subscribe({
      next: (response: any) => {
        if (response.userToken) {
          localStorage.setItem('userToken', response.userToken);
          localStorage.setItem(
            'decodedUser',
            JSON.stringify(jwtDecode(response.userToken)),
          );

          this.loginForm.reset();

          this.toastr.success('Welcome back', 'Login successfully');

          this.router.navigate(['/']);
        } else {
          this.toastr.error('Failed to login');
        }
      },
      error: (err) => {
        this.toastr.error('Error: ' + (err.error?.error || 'Unknown error'));
      },
    });
  }
}
