import { Component } from '@angular/core';
//import { AuthService } from '../../services/auth.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  username: string = '';

  //constructor(private authService: AuthService) {}

  ngOnInit(): void {
    //this.username = this.authService.getUserName();
  }
}
