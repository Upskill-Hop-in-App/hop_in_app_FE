import { Component, OnInit } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  userToken: string | null = null

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userToken = this.authService.getToken()
  }
}
