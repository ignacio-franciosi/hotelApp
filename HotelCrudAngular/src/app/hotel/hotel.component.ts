import { Component, OnInit } from '@angular/core';
import { HotelService } from '../hotel.service';
import { Hotel } from '../hotel.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css'],
})
export class HotelComponent implements OnInit {
  hotels: Observable<Hotel[]> = new Observable<Hotel[]>();
  imgLoadingDisplay: string = 'none';

  constructor(
    private hotelService: HotelService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getHotels();
  }

  getHotels() {
    this.hotels = this.hotelService.getAllHotel();
    return this.hotels;
  }

  addHotel() {
    this.router.navigate(['/addhotel']);
  }

  deleteHotel(id: number) {
    this.hotelService
      .deleteHotelById(id)
      .subscribe((result) =>
        this.getHotels().subscribe(
          (result) => (this.imgLoadingDisplay = 'none')
        )
      );
    this.imgLoadingDisplay = 'inline';
  }

  editHotel(id: number) {
    this.router.navigate(['/addhotel'], { queryParams: { id: id } });
  }

  
  searchItem(value: string) {
    this.hotelService.getAllHotel().subscribe((res) => {
      this.hotels = of(res);

      this.hotels
        .pipe(
          map((plans) =>
            plans.filter((results, emp) => results.name.indexOf(value) != -1)
          )
        )
        .subscribe((results) => {
          let hotelList: Hotel[] = [];
          for (let index = 0; index < results.length; index++) {
            hotelList.push(
              new Hotel(
                results[index].id,
                results[index].name,
                results[index].price,
                results[index].rooms,
                results[index].city
              )
            );
          }
          this.hotels = of(hotelList);
        });
    });
  }
}