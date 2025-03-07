import { Routes } from '@angular/router'
import { LiftComponent } from './components/lift/lift.component'
import { MyLiftsComponent } from './components/my-lifts/my-lifts.component'
import { MyApplicationsComponent } from './components/my-applications/my-applications.component'
import { ProfileComponent } from './components/profile/profile.component'
import { AdminGuard } from './guards/admin.guard'
import { UserGuard } from './guards/user.guard'
import { RegisterComponent } from './components/register/register.component'
import { LoginComponent } from './components/login/login.component'
import { MyCarsComponent } from './components/my-cars/my-cars.component'
import { HomeComponent } from './components/home/home.component'
import { ManageCarsComponent } from './components/manage-cars/manage-cars.component';
import { RgpdComponent } from './components/rgpd/rgpd.component';
import { CurrentLiftComponent } from './current-lift/current-lift.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'my-cars', component: MyCarsComponent, canActivate: [UserGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'lifts', component: LiftComponent, canActivate: [UserGuard] },
  { path: 'my-lifts', component: MyLiftsComponent, canActivate: [UserGuard] },
  { path: 'manage-cars', component: ManageCarsComponent,canActivate: [AdminGuard]},
  {
    path: 'my-applications',
    component: MyApplicationsComponent,
    canActivate: [UserGuard],
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'rgpd', component: RgpdComponent },
  { path: 'current-lift', component: CurrentLiftComponent}
]
