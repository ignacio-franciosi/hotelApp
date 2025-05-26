import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddhotelComponent } from './addhotel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HotelService } from '../hotel.service';
import { Hotel } from '../hotel.model';

describe('AddhotelComponent', () => {
  let component: AddhotelComponent;
  let fixture: ComponentFixture<AddhotelComponent>;
  let hotelServiceSpy: jasmine.SpyObj<HotelService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let routerSpy: jasmine.SpyObj<Router>;
  
//mocks
  beforeEach(async () => {
    const hotelServiceMock = jasmine.createSpyObj('HotelService', ['createHotel', 'updateHotel', 'getHotelById']);
    const toastrMock = jasmine.createSpyObj('ToastrService', ['error']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddhotelComponent, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: HotelService, useValue: hotelServiceMock },
        { provide: ToastrService, useValue: toastrMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) } // sin ID por defecto
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddhotelComponent);
    component = fixture.componentInstance;
    hotelServiceSpy = TestBed.inject(HotelService) as jasmine.SpyObj<HotelService>;
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if hotel name is empty', fakeAsync(async () => {
    const hotel = new Hotel(0, '', 100, 2, 'City');
    await component.addHotel(hotel);
    expect(toastrSpy.error).toHaveBeenCalledWith('El nombre del hotel es obligatorio.');
  }));

  it('should show error if price is less than or equal to 0', fakeAsync(async () => {
    const hotel = new Hotel(0, 'Hotel ABC', 0, 2, 'City');
    await component.addHotel(hotel);
    expect(toastrSpy.error).toHaveBeenCalledWith('El precio del hotel es obligatorio.');
  }));

  it('should show error if rooms is 0', fakeAsync(async () => {
    const hotel = new Hotel(0, 'Hotel ABC', 200, 0, 'City');
    await component.addHotel(hotel);
    expect(toastrSpy.error).toHaveBeenCalledWith('El número de habitaciones es obligatorio.');
  }));

  it('should call createHotel and show alert on valid data', fakeAsync(async () => {
    spyOn(window, 'alert');
    const hotel = new Hotel(0, 'Nice Hotel', 150, 3, 'NiceCity');
    hotelServiceSpy.createHotel.and.returnValue(of(hotel));

    await component.addHotel(hotel);
    tick();

    expect(hotelServiceSpy.createHotel).toHaveBeenCalledWith(hotel);
    expect(window.alert).toHaveBeenCalledWith('Hotel creado con éxito ✅');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should call updateHotel if hotel id is not 0', fakeAsync(async () => {
    const hotel = new Hotel(5, 'Updated Hotel', 300, 4, 'City');
    hotelServiceSpy.updateHotel.and.returnValue(of(hotel));

    await component.addHotel(hotel);
    tick();

    expect(hotelServiceSpy.updateHotel).toHaveBeenCalledWith(hotel);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should load hotel data in editHotel', () => {
    const hotelData = new Hotel(1, 'Loaded Hotel', 100, 2, 'LoadedCity');
    hotelServiceSpy.getHotelById.and.returnValue(of(hotelData));

    component.editHotel(1);

    expect(component.newHotel.name).toBe('Loaded Hotel');
    expect(component.newHotel.city).toBe('LoadedCity');
    expect(component.submitBtnText).toBe('Edit');
  });
});
