import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { CursoService } from './curso.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { API_URL } from '../utils/constants';

describe('CursoService', () => {
  let service: CursoService;
  let httpMock: HttpTestingController;

  const mockCurso = {
    id: 1,
    titulo: 'Angular Basics',
    descripcion: 'Learn Angular fundamentals',
    precio: 29.99,
    puntuacion: 4.5,
    categoria: 1
  };

  const mockCursos = [
    { id: 1, titulo: 'Angular Basics', precio: 29.99 },
    { id: 2, titulo: 'Angular Advanced', precio: 49.99 },
    { id: 3, titulo: 'Angular Testing', precio: 39.99 }
  ];

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
    service = TestBed.inject(CursoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCursoPorId', () => {
    it('should fetch course by id', (done) => {
      service.getCursoPorId(1).subscribe((curso) => {
        expect(curso).toEqual(mockCurso);
        expect(curso.id).toBe(1);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/cursos/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCurso);
    });

    it('should handle course not found', (done) => {
      service.getCursoPorId(999).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/cursos/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle API error', (done) => {
      service.getCursoPorId(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/cursos/1`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should fetch different courses by id', (done) => {
      const curso2 = { id: 2, titulo: 'React Basics', precio: 29.99 };
      service.getCursoPorId(2).subscribe((curso) => {
        expect(curso).toEqual(curso2);
        expect(curso.id).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/cursos/2`);
      req.flush(curso2);
    });

    it('should handle network error', (done) => {
      service.getCursoPorId(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.error.type).toBe('Network error');
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/cursos/1`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('search', () => {
    it('should search courses by title', (done) => {
      service.search('Angular').subscribe((cursos) => {
        expect(cursos).toEqual(mockCursos);
        expect(cursos.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}cursos/search/findByTituloContaining?titulo=Angular`);
      expect(req.request.method).toBe('GET');
      req.flush({ _embedded: { cursos: mockCursos } });
    });

    it('should handle empty search results', (done) => {
      service.search('NonExistent').subscribe((cursos) => {
        expect(cursos).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}cursos/search/findByTituloContaining?titulo=NonExistent`);
      req.flush({ _embedded: { cursos: [] } });
    });

    it('should handle search with special characters', (done) => {
      service.search('C++').subscribe((cursos) => {
        expect(cursos).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}cursos/search/findByTituloContaining?titulo=C++`);
      req.flush({ _embedded: { cursos: [] } });
    });

    it('should handle API error on search', (done) => {
      service.search('Angular').subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}cursos/search/findByTituloContaining?titulo=Angular`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error on search', (done) => {
      service.search('Angular').subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.error.type).toBe('Network error');
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}cursos/search/findByTituloContaining?titulo=Angular`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should search with different query strings', (done) => {
      const searchResults = [
        { id: 4, titulo: 'React Basics', precio: 29.99 }
      ];
      service.search('React').subscribe((cursos) => {
        expect(cursos).toEqual(searchResults);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}cursos/search/findByTituloContaining?titulo=React`);
      req.flush({ _embedded: { cursos: searchResults } });
    });
  });
});
