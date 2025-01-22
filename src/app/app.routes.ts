import { Routes } from '@angular/router';
import { LiftComponent } from './components/lift/lift.component';
import { MyLiftsComponent } from './components/my-lifts/my-lifts.component';
import { CurrentLiftComponent } from './current-lift/current-lift.component';

export const routes: Routes = [
  { path: 'lifts', component: LiftComponent },
  { path: 'my-lifts', component: MyLiftsComponent },
  { path: 'current-lift', component: CurrentLiftComponent}
];
