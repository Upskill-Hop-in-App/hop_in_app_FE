import { Component, HostListener } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { NgOptimizedImage } from '@angular/common'
import { AttachedIconPipe } from '../../pipes/attached-icon.pipe'
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { faSun } from '@fortawesome/free-regular-svg-icons'
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
  sidebarVisible: boolean = false
  menuNavbarVisible: boolean = false
  username: string | null = null
  userRole: string | null = null
  userToken: string | null = null

  constructor(
    private authService: AuthService,
    library: FaIconLibrary,
  ) {
    library.addIcons(faMoon, faSun)
  }

  ngAfterViewInit(): void {
    this.username = this.authService.getUserName()
    this.userRole = this.authService.getUserRole()
    this.userToken = this.authService.getToken()
    const theme = localStorage.getItem('theme')
    const themeToggleCheckbox = document.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement

    if (theme === 'dark') {
      themeToggleCheckbox.checked = true
    } else {
      themeToggleCheckbox.checked = false
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible
  }

  toggleMenuNavbar() {
    this.username = this.authService.getUserName()
    this.userRole = this.authService.getUserRole()
    this.userToken = this.authService.getToken()
    this.menuNavbarVisible = !this.menuNavbarVisible
  }

  @HostListener('window:click', ['$event'])
onDocumentClick(event?: MouseEvent) {
  if (!event) {
    return;
  }

  const target = event.target as HTMLElement;
  const dropdownElement = document.getElementById('dropdown-user');
  const toggleButton = document.querySelector(
    '[data-dropdown-toggle="dropdown-user"]'
  );

  if (
    dropdownElement &&
    !dropdownElement.contains(target) &&
    (!toggleButton || !toggleButton.contains(target))
  ) {
    this.closeMenuNavbar();
  }
}

  closeSidebar() {
    this.sidebarVisible = false
  }

  closeMenuNavbar() {
    this.menuNavbarVisible = false
  }

  toggleTheme() {
    document.body.classList.toggle('dark')

    if (document.body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark')
    } else {
      localStorage.setItem('theme', 'light')
    }

    const themeToggleCheckbox = document.querySelector(
      'input[name="theme-toggle"]'
    ) as HTMLInputElement

    themeToggleCheckbox.checked = document.body.classList.contains('dark')
  }

  logout() {
    this.authService.logout();
    this.closeMenuNavbar()
  }
}
