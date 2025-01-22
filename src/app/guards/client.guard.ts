import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ClientGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  canActivate(): boolean {
    if (this.authService.isClientAuth()) {
      return true;
    } else {
      this.toastr.error('Access denied. Authenticated client only.');
      this.router.navigate(['/']);
      return false;
    }
  }
}
