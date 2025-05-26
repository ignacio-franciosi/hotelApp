import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HotelComponent } from './hotel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, defer } from 'rxjs';
import { HotelService } from '../hotel.service';
import { Hotel } from '../hotel.model';

describe('HotelComponent', () => {
  let component: HotelComponent;
  let fixture: ComponentFixture<HotelComponent>;
  let hotelServiceSpy: jasmine.SpyObj<HotelService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    hotelServiceSpy = jasmine.createSpyObj('HotelService', ['getAllHotel', 'deleteHotelById']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HotelComponent, HttpClientTestingModule],
      providers: [
        { provide: HotelService, useValue: hotelServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HotelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load hotels on init', () => {
    const dummyHotels: Hotel[] = [
      new Hotel(1, 'Hotel A', 100, 10, 'Madrid'),
      new Hotel(2, 'Hotel B', 200, 20, 'Barcelona')
    ];
    hotelServiceSpy.getAllHotel.and.returnValue(of(dummyHotels));
    
    component.ngOnInit();

    component.hotels.subscribe(hotels => {
      expect(hotels.length).toBe(2);
      expect(hotels[0].name).toBe('Hotel A');
    });

    expect(hotelServiceSpy.getAllHotel).toHaveBeenCalled();
  });

  it('should call router.navigate to addhotel on addHotel()', () => {
    component.addHotel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/addhotel']);
  });

  it('should call deleteHotelById and refresh list on deleteHotel()', fakeAsync(() => {
    hotelServiceSpy.deleteHotelById.and.returnValue(of(true));
    hotelServiceSpy.getAllHotel.and.returnValue(of([]));

    component.deleteHotel(1);
    tick(); // simula tiempo de espera asíncrona

    expect(hotelServiceSpy.deleteHotelById).toHaveBeenCalledWith(1);
    expect(hotelServiceSpy.getAllHotel).toHaveBeenCalledTimes(1); 
    expect(component.imgLoadingDisplay).toBe('inline');
  }));

  it('should call router.navigate with id param on editHotel()', () => {
    component.editHotel(3);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/addhotel'], { queryParams: { id: 3 } });
  });
});
