import { Routes } from '@angular/router';
import { AddhotelComponent } from './addhotel/addhotel.component';
import { HotelComponent } from './hotel/hotel.component';

export const routes: Routes = [
  { path: 'addhotel', component: AddhotelComponent },
  { path: '**', component: HotelComponent },
];
