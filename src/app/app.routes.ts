import { Routes } from '@angular/router';
import { LiftComponent } from './components/lift/lift.component';
import { MyLiftsComponent } from './components/my-lifts/my-lifts.component';
import { MyCarsComponent } from './components/my-cars/my-cars.component';

export const routes: Routes = [
  { path: 'my-cars', component: MyCarsComponent }, 
  { path: 'lifts', component: LiftComponent },
  { path: 'my-lifts', component: MyLiftsComponent },
];
