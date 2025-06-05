import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { CarritoService } from './carrito.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CarritoService', () => {
  let service: CarritoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    imports: [],
    providers: [
        CarritoService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });

  beforeEach(() => {
    service = TestBed.inject(CarritoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
