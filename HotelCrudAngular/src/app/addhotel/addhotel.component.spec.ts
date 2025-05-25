import { TestBed } from '@angular/core/testing';
import { AddhotelComponent } from './addhotel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // para simular observables
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('AddhotelComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddhotelComponent, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        ToastrService,
        {
          provide: ActivatedRoute, // Simula ActivatedRoute
          useValue: {
            params: of({ id: 1 }) // simula el parámetro id en la URL
          }
        }
      ]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AddhotelComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});