import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { CursoService } from './curso.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('CursoService', () => {
  let service: CursoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    imports: [],
    providers: [
        CursoService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });
  
  beforeEach(() => {
    service = TestBed.inject(CursoService);
    httpMock = TestBed.inject(HttpTestingController);
  })

  afterEach(()=>{
    // esperar a que no haya peticiones pendientes del test
    httpMock.verify();
  })


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
