import { Component, OnInit } from '@angular/core';
import { Hotel } from '../hotel.model';
import { HotelService } from '../hotel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addhotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addhotel.component.html',
  styleUrls: ['./addhotel.component.css']
})
export class AddhotelComponent implements OnInit {
  newHotel: Hotel = new Hotel(0, '', 0, 0, '');
  submitBtnText: string = "Create";
  imgLoadingDisplay: string = 'none';

  constructor(
    private hotelService: HotelService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const hotelId = params['id'];
      if (hotelId) {
        this.editHotel(hotelId);
      }
    });
  }

  async addHotel(hotel: Hotel) {
    if (!hotel.name) {
      this.toastr.error("El nombre del hotel es obligatorio.");
      return;
    }

    if (hotel.name === "") {
      this.toastr.error("El nombre del hotel no puede estar vacío.");
      return;
    }

    if (!hotel.price) {
      this.toastr.error("El precio del hotel es obligatorio.");
      return;
    }

    if (hotel.price <= 0) {
      this.toastr.error("El precio de las habitaciones debe ser mayor a 0");
      return;
    }

    if (!hotel.rooms) {
      this.toastr.error("El número de habitaciones es obligatorio.");
      return;
    }

    if (!hotel.city) {
      this.toastr.error("El nombre de ciudad no puede estar vacío.");
      return;
    }

    if (hotel.name.length < 2) {
      this.toastr.error("El nombre del hotel debe tener al menos 2 caracteres.");
      return;
    }

    if (/\d/.test(hotel.city)) {
      this.toastr.error("El nombre de ciudad no puede contener números.");
      return;
    }

    if (hotel.rooms <= 0) {
      this.toastr.error("El campo rooms debe ser mayor a 0.");
      return;
    }

    // Guardar el hotel
    if (hotel.id === 0) {
      await this.hotelService.createHotel(hotel).toPromise();
      alert('Hotel creado con éxito ✅');
    } else {
      await this.hotelService.updateHotel(hotel).toPromise();
    }

    this.router.navigate(['/']);
  }

  editHotel(hotelId: number) {
    this.hotelService.getHotelById(hotelId).subscribe(res => {
      this.newHotel.id = res.id;
      this.newHotel.name = res.name;
      this.newHotel.price = res.price;
      this.newHotel.rooms = res.rooms;
      this.newHotel.city = res.city;
      this.submitBtnText = "Edit";
    });
  }
}
