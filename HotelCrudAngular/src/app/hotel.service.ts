import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from './hotel.model';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment'; // Importa el environment


@Injectable({
  providedIn: 'root',
})
export class HotelService {
  apiUrlHotel = environment.apiUrl;  // Usa el valor de environment

  constructor(private http: HttpClient) {}

  getAllHotel(): Observable<Hotel[]> {
    return this.http
      .get<Hotel[]>(this.apiUrlHotel + '/getall')
      .pipe(
        map((data: Hotel[]) =>
          data.map(
            (item: Hotel) =>
              new Hotel(
                item.id,
                item.name,
                item.price,
                item.rooms,
                item.city
              )
          )
        )
      );
  }


  getHotelById(hotelId: number): Observable<Hotel> {
    return this.http.get<Hotel>(
      this.apiUrlHotel + '/getbyid/?id=' + hotelId
    );
  }
  createHotel(hotel: Hotel): Observable<Hotel> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<Hotel>(
      this.apiUrlHotel + '/create',
      hotel,
      httpOptions
    );
  }
  updateHotel(hotel: Hotel): Observable<Hotel> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.put<Hotel>(
      this.apiUrlHotel + '/update',
      hotel,
      httpOptions
    );
  }

  deleteHotelById(hotelid: number) {
    let endPoints = '/posts/1';
    return this.http.delete(this.apiUrlHotel + '/Delete/?id=' + hotelid);
  }
}
