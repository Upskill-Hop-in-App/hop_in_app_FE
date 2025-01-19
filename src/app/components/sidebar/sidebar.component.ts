import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faCircleUser,
  faCircleXmark,
  faUsers,
  faRightFromBracket,
  faRightToBracket,
  faHome,
  faBars,
  faUserPlus,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';
//import { AuthService } from '../../services/auth.service';
import { faSun } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  sidebarVisible: boolean = false;
  menuNavbarVisible: boolean = false;

  constructor(
    //private authService: AuthService,
    library: FaIconLibrary,
  ) {
    library.addIcons(
      faCircleXmark,
      faUsers,
      faRightFromBracket,
      faRightToBracket,
      faMoon,
      faSun,
      faUserPlus,
      faHome,
      faCircleUser,
      faBars,
    );
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

  // isAdminAuth(): boolean {
  //   return this.authService.isAdminAuth();
  // }

  // isEmployeeAuth(): boolean {
  //   return this.authService.isEmployeeAuth();
  // }

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

  @HostListener('window:click', ['$event'])
  onDocumentClick(event?: MouseEvent) {
    if (!event) {
      return;
    }
    const target = event.target as HTMLElement;
    const dropdownElement = document.getElementById('dropdown-user');
    const toggleButton = document.querySelector(
      '[data-dropdown-toggle="dropdown-user"]',
    );

    if (
      this.menuNavbarVisible === true &&
      dropdownElement &&
      !dropdownElement.contains(target) &&
      target !== toggleButton
    ) {
      this.closeMenuNavbar();
    }
  }

  // logout() {
  //   this.authService.logout();
  //   this.closeMenuNavbar();
  // }
}
