import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {
  FormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { catchError, of } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';
import { User, UserPassword, UserUpdate } from '../../models/user.model';
import { DOCUMENT } from '@angular/common';
import { AttachedIconPipe } from '../../pipes/attached-icon.pipe';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    ModalComponent,
    AttachedIconPipe,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  user: User = this.reset();
  auxiliarUser: User = this.reset();
  backupUser: User = this.reset();
  showPasswordForm: boolean = false;
  showProfileForm: boolean = false;
  showDeleteForm: boolean = false;
  currentModalTitle: string = '';
  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    contact: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[+]?[0-9]{9,12}$/),
    ]),
  });

  passwordForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator },
  );

  deleteForm = new FormGroup({});

  //TODO mudar aqui para ir busca-lo ao token
  clientUsername: string = 'tobiaslindo';

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private UserService: UserService,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getUserByUsername(this.clientUsername);
  }

  getUserByUsername(username: string) {
    this.UserService.getUserByUsername(username)
      .pipe(
        catchError((err) => {
          this.toastr.error('No user found', err?.error?.message);
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response) {
          this.user = response.data;
        } else {
          this.reset();
        }
      });
  }

  reset(): User {
    return {
      email: '',
      username: '',
      name: '',
      contact: '',
    };
  }

  toggleEditProfile() {
    this.currentModalTitle = 'Edit profile';
    this.showProfileForm = true;
    this.showPasswordForm = false;
    this.showDeleteForm = false;
    this.backupUser = this.user;
    this.profileForm.setValue({
      name: this.backupUser.name!,
      username: this.backupUser.username!,
      email: this.backupUser.email!,
      contact: this.backupUser.contact!,
    });
    this.openModal();
  }

  confirmEditProfile() {
    (this.auxiliarUser.name = this.profileForm.value.name!),
      (this.auxiliarUser.username = this.profileForm.value.username!),
      (this.auxiliarUser.email = this.profileForm.value.email!),
      (this.auxiliarUser.contact = this.profileForm.value.contact!),
      this.UserService.updateProfile(
        this.user.username,
        this.auxiliarUser,
      ).subscribe({
        next: () => {
          this.toastr.success('Profile updated successfully.');
          this.cancel();
          this.getUserByUsername(this.clientUsername);
        },
        error: () => {
          this.toastr.error('Failed to update profile.');
        },
      });
  }

  toggleEditPassword() {
    this.currentModalTitle = 'Change password';
    this.showProfileForm = false;
    this.showPasswordForm = true;
    this.showDeleteForm = false;
    this.passwordForm.setValue({
      password: '',
      confirmPassword: '',
    });
    this.openModal();
  }

  confirmEditPassword() {
    const password: UserPassword = {
      password: this.passwordForm.value.confirmPassword!,
    };
    if (
      this.passwordForm.value.password !=
      this.passwordForm.value.confirmPassword
    ) {
      this.toastr.error('Passwords do not match');
    } else {
      this.UserService.updatePassword(this.user.username, password).subscribe({
        next: () => {
          this.toastr.success('Password updated successfully.');
          this.cancel();
          this.getUserByUsername(this.clientUsername);
        },
        error: () => {
          this.toastr.error('Failed to update password.');
        },
      });
    }
  }

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  openModal(): void {
    this.modalComponent.openModal();
  }

  cancel(): void {
    this.modalComponent.closeModal();
    this.resetForm();
  }

  resetForm() {
    this.profileForm.reset();
    this.passwordForm.reset();
    this.deleteForm.reset();
  }
}
