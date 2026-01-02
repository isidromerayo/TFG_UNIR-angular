import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { CategoriaService } from './categoria.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { API_URL } from '../utils/constants';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let httpMock: HttpTestingController;

  const mockCategorias = [
    { id: 1, nombre: 'Angular', descripcion: 'Angular framework' },
    { id: 2, nombre: 'React', descripcion: 'React library' },
    { id: 3, nombre: 'Vue', descripcion: 'Vue framework' },
    { id: 4, nombre: 'TypeScript', descripcion: 'TypeScript language' },
    { id: 5, nombre: 'JavaScript', descripcion: 'JavaScript language' }
  ];

  const mockCategoria = mockCategorias[0];

  const mockCursos = [
    { id: 1, titulo: 'Angular Basics', precio: 29.99, categoria: 1 },
    { id: 2, titulo: 'Advanced Angular', precio: 49.99, categoria: 1 },
    { id: 3, titulo: 'Angular Testing', precio: 39.99, categoria: 1 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [],
      providers: [
        CategoriaService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CategoriaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllCategorias', () => {
    it('should fetch all categories sorted by name', (done) => {
      service.getAllCategorias().subscribe((categorias) => {
        expect(categorias).toEqual(mockCategorias);
        expect(categorias.length).toBe(5);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/categorias?sort=nombre`);
      expect(req.request.method).toBe('GET');
      req.flush({ _embedded: { categorias: mockCategorias } });
    });

    it('should handle empty categories response', (done) => {
      service.getAllCategorias().subscribe((categorias) => {
        expect(categorias).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/categorias?sort=nombre`);
      req.flush({ _embedded: { categorias: [] } });
    });

    it('should handle API error', (done) => {
      service.getAllCategorias().subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/categorias?sort=nombre`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', (done) => {
      service.getAllCategorias().subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.error.type).toBe('Network error');
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/categorias?sort=nombre`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getCategoriaId', () => {
    it('should fetch category by id', (done) => {
      service.getCategoriaId(1).subscribe((categoria) => {
        expect(categoria).toEqual(mockCategoria);
        expect(categoria.id).toBe(1);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/categorias/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategoria);
    });

    it('should handle category not found', (done) => {
      service.getCategoriaId(999).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/categorias/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle API error', (done) => {
      service.getCategoriaId(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/categorias/1`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should fetch different categories by id', (done) => {
      const categoria2 = mockCategorias[1];
      service.getCategoriaId(2).subscribe((categoria) => {
        expect(categoria).toEqual(categoria2);
        expect(categoria.id).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/categorias/2`);
      req.flush(categoria2);
    });
  });

  describe('getCategoriaIdCursos', () => {
    it('should fetch courses for a category', (done) => {
      service.getCategoriaIdCursos(1).subscribe((cursos) => {
        expect(cursos).toEqual(mockCursos);
        expect(cursos.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/categorias/1/cursos`);
      expect(req.request.method).toBe('GET');
      req.flush({ _embedded: { cursos: mockCursos } });
    });

    it('should handle empty courses for category', (done) => {
      service.getCategoriaIdCursos(1).subscribe((cursos) => {
        expect(cursos).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/categorias/1/cursos`);
      req.flush({ _embedded: { cursos: [] } });
    });

    it('should handle category not found', (done) => {
      service.getCategoriaIdCursos(999).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/categorias/999/cursos`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle API error', (done) => {
      service.getCategoriaIdCursos(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/categorias/1/cursos`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should fetch courses for different categories', (done) => {
      const cursos2 = [
        { id: 4, titulo: 'React Basics', precio: 29.99, categoria: 2 },
        { id: 5, titulo: 'Advanced React', precio: 49.99, categoria: 2 }
      ];
      service.getCategoriaIdCursos(2).subscribe((cursos) => {
        expect(cursos).toEqual(cursos2);
        expect(cursos.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/categorias/2/cursos`);
      req.flush({ _embedded: { cursos: cursos2 } });
    });

    it('should handle network error', (done) => {
      service.getCategoriaIdCursos(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.error.type).toBe('Network error');
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/categorias/1/cursos`);
      req.error(new ErrorEvent('Network error'));
    });
  });
});
