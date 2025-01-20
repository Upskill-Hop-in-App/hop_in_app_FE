import { Routes } from '@angular/router';
import { LiftComponent } from './components/lift/lift.component';
import { MyLiftsComponent } from './components/my-lifts/my-lifts.component';
import { MyApplicationsComponent } from './components/my-applications/my-applications.component';

export const routes: Routes = [
  { path: 'lifts', component: LiftComponent },
  { path: 'my-lifts', component: MyLiftsComponent },
  { path: 'my-applications', component: MyApplicationsComponent },
];
