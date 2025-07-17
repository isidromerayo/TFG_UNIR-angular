import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { CursoService } from './curso.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


import { API_URL } from '../utils/constants';

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

  it('should get a course by id', () => {
    const dummyCurso = { id: 1, titulo: 'Test Course' };
    service.getCursoPorId(1).subscribe(curso => {
      expect(curso).toEqual(dummyCurso);
    });
    const req = httpMock.expectOne(`${API_URL}/cursos/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCurso);
  });

  it('should handle errors when getting a course by id', () => {
    service.getCursoPorId(1).subscribe(
      () => fail('should have failed with 404 error'),
      (error) => {
        expect(error.status).toBe(404);
      }
    );
    const req = httpMock.expectOne(`${API_URL}/cursos/1`);
    expect(req.request.method).toBe('GET');
    req.flush('Something went wrong', { status: 404, statusText: 'Not Found' });
  });

  it('should search for courses', () => {
    const dummyCursos = [{ id: 1, titulo: 'Test Course' }];
    service.search('Test').subscribe(cursos => {
      expect(cursos).toEqual(dummyCursos);
    });
    const req = httpMock.expectOne(`${API_URL}cursos/search/findByTituloContaining?titulo=Test`);
    expect(req.request.method).toBe('GET');
    req.flush({ _embedded: { cursos: dummyCursos } });
  });

  it('should return an empty array when search finds no courses', () => {
    service.search('Test').subscribe(cursos => {
      expect(cursos).toEqual([]);
    });
    const req = httpMock.expectOne(`${API_URL}cursos/search/findByTituloContaining?titulo=Test`);
    expect(req.request.method).toBe('GET');
    req.flush({ _embedded: { cursos: [] } });
  });
});
