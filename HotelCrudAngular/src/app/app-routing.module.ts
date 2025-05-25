import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddhotelComponent } from './addhotel/addhotel.component';
import { HotelComponent } from './hotel/hotel.component';

const routes: Routes = [
  { path: 'addhotel', component: AddhotelComponent },
  { path: '**', component: HotelComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }