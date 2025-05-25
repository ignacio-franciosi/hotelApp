import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HotelService } from './hotel.service'; // Asegúrate de que la ruta es correcta
import { Hotel } from './hotel.model';       // Asegúrate de que la ruta es correcta

describe('HotelService', () => {
  let service: HotelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HotelService]
    });

    service = TestBed.inject(HotelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all hotels', () => {
    const dummyHotels: Hotel[] = [
      { id: 1, name: 'Hotel A', price: 100.0, rooms: 10, city: 'City A' },
      { id: 2, name: 'Hotel B', price: 200.0, rooms: 20, city: 'City B' }
    ];

    service.getAllHotel().subscribe(hotels => {
      expect(hotels.length).toBe(2);
      hotels.forEach((hotel, index) => {
        expect(hotel.id).toBe(dummyHotels[index].id);
        expect(hotel.name).toBe(dummyHotels[index].name);
        expect(hotel.price).toBe(dummyHotels[index].price);
        expect(hotel.rooms).toBe(dummyHotels[index].rooms);
        expect(hotel.city).toBe(dummyHotels[index].city);
      });
    });

    const req = httpMock.expectOne(`${service.apiUrlHotel}/getall`); // Ajusta la URL si es necesario
    expect(req.request.method).toBe('GET');
    req.flush(dummyHotels);
  });
});
