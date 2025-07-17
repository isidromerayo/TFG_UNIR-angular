import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthenticationService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storage = {}; 

  beforeEach(() => {
    TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    imports: [],
    providers: [
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });
  beforeEach(() => {
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // limpiar storage

    /*spyOn(localStorage, 'getItem').and.callFake((key:string) => {
        return storage[key] ? storage[key] : null;
    })

    spyOn(localStorage, 'setItem').and.callFake((key:string, value:string) => {
        return storage[key]=value;
    })*/
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
