import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AuthService } from './auth.service';

describe('AuthenticationService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storage = {}; 

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
  });
  beforeEach(() => {
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // limpiar storage
    storage = {};

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
