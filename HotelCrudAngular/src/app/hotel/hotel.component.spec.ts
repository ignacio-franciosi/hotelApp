import { TestBed } from '@angular/core/testing';
import { HotelComponent } from './hotel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';

describe('HotelComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HotelComponent, HttpClientTestingModule],
      providers: [DatePipe] 
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HotelComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});