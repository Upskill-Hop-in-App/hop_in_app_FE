import { Routes } from '@angular/router';
import { LiftComponent } from './components/lift/lift.component';
import { MyLiftsComponent } from './components/my-lifts/my-lifts.component';

export const routes: Routes = [
  { path: 'lifts', component: LiftComponent },
  { path: 'my-lifts', component: MyLiftsComponent },
];
