import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { AttachedIconPipe } from '../../pipes/attached-icon.pipe';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from '../../services/auth.service';
import { UserRoles } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink,
    NgOptimizedImage,
    AttachedIconPipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class SidebarComponent {
  sidebarVisible: boolean = false;
  menuNavbarVisible: boolean = false;

  constructor(
    private authService: AuthService,
    library: FaIconLibrary,
  ) {
    library.addIcons(faMoon, faSun);
  }

  ngAfterViewInit(): void {
    const theme = localStorage.getItem('theme');
    const themeToggleCheckbox = document.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    if (theme === 'dark') {
      themeToggleCheckbox.checked = true;
    } else {
      themeToggleCheckbox.checked = false;
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleMenuNavbar() {
    this.menuNavbarVisible = !this.menuNavbarVisible;
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }

  closeMenuNavbar() {
    this.menuNavbarVisible = false;
  }

  toggleTheme() {
    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }

    const themeToggleCheckbox = document.querySelector(
      'input[name="theme-toggle"]',
    ) as HTMLInputElement;

    themeToggleCheckbox.checked = document.body.classList.contains('dark');
  }

  logout() {
    this.authService.logout();
    this.closeMenuNavbar();
  }
}
