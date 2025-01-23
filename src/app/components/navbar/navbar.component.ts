import { Component, HostListener } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, Router } from '@angular/router'
import { NgOptimizedImage } from '@angular/common'
import { AttachedIconPipe } from '../../pipes/attached-icon.pipe'
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { faSun } from '@fortawesome/free-regular-svg-icons'
import { AuthService } from '../../services/auth.service'

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
  isSmallScreen: boolean = false
  isLargeScreen: boolean = false
  isHomePage: boolean = false
  userDropdownVisible: boolean = false

  constructor(
    private authService: AuthService,
    private router: Router,
    library: FaIconLibrary
  ) {
    library.addIcons(faMoon, faSun)
  }

  ngAfterViewInit(): void {
    const theme = localStorage.getItem('theme')
    const themeToggleCheckbox = document.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement

    if (theme === 'dark') {
      themeToggleCheckbox.checked = true
    } else {
      themeToggleCheckbox.checked = false
    }

    this.isSmallScreen = window.innerWidth < 768
    this.isLargeScreen = window.innerWidth > 1024

    this.checkIfHomePage()

    this.router.events.subscribe(() => {
      this.checkIfHomePage()
    })
  }

  @HostListener('window:click', ['$event'])
  onDocumentClick(event?: MouseEvent) {
    if (!event) {
      return
    }
    const target = event.target as HTMLElement
    const dropdownElement = document.getElementById('dropdown-user')
    const toggleButton = document.querySelector(
      '[data-dropdown-toggle="dropdown-user"]'
    )

    if (
      dropdownElement &&
      !dropdownElement.contains(target) &&
      target !== toggleButton
    ) {
      this.closeUserDropdown()
    }
  }

  checkIfHomePage() {
    this.isHomePage = this.router.url === '/'
  }

  onResize() {
    this.isSmallScreen = window.innerWidth < 768
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible
  }

  closeUserDropdown() {
    this.userDropdownVisible = false
  }

  toggleMenuNavbar() {
    this.menuNavbarVisible = !this.menuNavbarVisible
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
    this.authService.logout()
    this.closeMenuNavbar()
  }
}
