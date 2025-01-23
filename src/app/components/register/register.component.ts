import { Component } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserRegister, UserRoles } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    role: new FormControl(UserRoles.client, [Validators.required]),
    contact: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    rgpd: new FormControl(false, [Validators.requiredTrue]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.registerForm.reset({
      role: UserRoles.client,
    });
  }

  isAdminAuth(): boolean {
    return this.authService.isAdminAuth();
  }

  register(): void {
    if (!this.registerForm.value.rgpd) {
      this.toastr.error('You must agree with the RGPD terms and conditions');
      return;
    }
    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {
      this.toastr.error('Passwords do not match');
      return;
    }

    const user: UserRegister = {
      email: this.registerForm.value.email!,
      username: this.registerForm.value.username!,
      name: this.registerForm.value.name!,
      role: this.registerForm.value.role!,
      contact: this.registerForm.value.contact!,
      password: this.registerForm.value.password!,
    };

    this.authService.register(user).subscribe({
      next: (response: any) => {
        this.toastr.success('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error('Error: ' + (err.error?.error || 'Unknown error'));
      },
    });
  }
}
