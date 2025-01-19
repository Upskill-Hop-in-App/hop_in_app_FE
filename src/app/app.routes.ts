import { Routes } from '@angular/router';
import * as cars from './components/cars/cars.component';
import { ManageCarsComponent } from './components/manage-cars/manage-cars.component';


export const routes: Routes = [
    { path: 'cars', component: cars.CarComponent },
    { path: 'manage-cars', component: ManageCarsComponent }
];
