import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { HomeService } from './home.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { API_URL } from '../utils/constants';

describe('HomeService', () => {
  let service: HomeService;
  let httpMock: HttpTestingController;

  const mockCursos = [
    { id: 1, titulo: 'Angular Basics', precio: 29.99, puntuacion: 4.5 },
    { id: 2, titulo: 'Advanced Angular', precio: 49.99, puntuacion: 4.8 },
    { id: 3, titulo: 'Angular Testing', precio: 39.99, puntuacion: 4.6 }
  ];

  const mockValoraciones = [
    { id: 1, puntuacion: 5, comentario: 'Excelente curso', usuario: 'user1' },
    { id: 2, puntuacion: 4, comentario: 'Muy bueno', usuario: 'user2' },
    { id: 3, puntuacion: 5, comentario: 'Perfecto', usuario: 'user3' }
  ];

  const mockCategorias = [
    { id: 1, nombre: 'Angular', descripcion: 'Angular framework' },
    { id: 2, nombre: 'React', descripcion: 'React library' },
    { id: 3, nombre: 'Vue', descripcion: 'Vue framework' },
    { id: 4, nombre: 'TypeScript', descripcion: 'TypeScript language' },
    { id: 5, nombre: 'JavaScript', descripcion: 'JavaScript language' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [],
      providers: [
        HomeService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(HomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have limite_portada set to 5', () => {
    expect(service.limite_portada).toBe(5);
  });

  describe('getCursosDestacadosPortada', () => {
    it('should fetch highlighted courses from API', (done) => {
      service.getCursosDestacadosPortada().subscribe((cursos) => {
        expect(cursos).toEqual(mockCursos);
        expect(cursos.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/cursos/search/selectMorePoints`);
      expect(req.request.method).toBe('GET');
      req.flush({ _embedded: { cursos: mockCursos } });
    });

    it('should handle empty response', (done) => {
      service.getCursosDestacadosPortada().subscribe((cursos) => {
        expect(cursos).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/cursos/search/selectMorePoints`);
      req.flush({ _embedded: { cursos: [] } });
    });

    it('should handle API error', (done) => {
      service.getCursosDestacadosPortada().subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/cursos/search/selectMorePoints`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getOpinionesCursosPortada', () => {
    it('should fetch course opinions from API', (done) => {
      service.getOpinionesCursosPortada().subscribe((valoraciones) => {
        expect(valoraciones).toEqual(mockValoraciones);
        expect(valoraciones.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/valoraciones/search/selectLastOpinions`);
      expect(req.request.method).toBe('GET');
      req.flush({ _embedded: { valoraciones: mockValoraciones } });
    });

    it('should handle empty opinions response', (done) => {
      service.getOpinionesCursosPortada().subscribe((valoraciones) => {
        expect(valoraciones).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/valoraciones/search/selectLastOpinions`);
      req.flush({ _embedded: { valoraciones: [] } });
    });

    it('should handle API error for opinions', (done) => {
      service.getOpinionesCursosPortada().subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/valoraciones/search/selectLastOpinions`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getCursosUltimasPortada', () => {
    it('should fetch latest updated courses from API', (done) => {
      service.getCursosUltimasPortada().subscribe((cursos) => {
        expect(cursos).toEqual(mockCursos);
        expect(cursos.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/cursos/search/selectLastUpdates`);
      expect(req.request.method).toBe('GET');
      req.flush({ _embedded: { cursos: mockCursos } });
    });

    it('should handle empty latest courses response', (done) => {
      service.getCursosUltimasPortada().subscribe((cursos) => {
        expect(cursos).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/cursos/search/selectLastUpdates`);
      req.flush({ _embedded: { cursos: [] } });
    });

    it('should handle API error for latest courses', (done) => {
      service.getCursosUltimasPortada().subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/cursos/search/selectLastUpdates`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getCategoriasPortada', () => {
    it('should fetch categories with limit from API', (done) => {
      service.getCategoriasPortada().subscribe((categorias) => {
        expect(categorias).toEqual(mockCategorias);
        expect(categorias.length).toBe(5);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/categorias?sort=nombre&size=5`);
      expect(req.request.method).toBe('GET');
      req.flush({ _embedded: { categorias: mockCategorias } });
    });

    it('should use limite_portada parameter in request', (done) => {
      service.limite_portada = 10;
      service.getCategoriasPortada().subscribe((categorias) => {
        expect(categorias).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/categorias?sort=nombre&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush({ _embedded: { categorias: [] } });
    });

    it('should handle empty categories response', (done) => {
      service.getCategoriasPortada().subscribe((categorias) => {
        expect(categorias).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/categorias?sort=nombre&size=5`);
      req.flush({ _embedded: { categorias: [] } });
    });

    it('should handle API error for categories', (done) => {
      service.getCategoriasPortada().subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/categorias?sort=nombre&size=5`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getValoracionPorId', () => {
    it('should fetch valoracion by id from API', (done) => {
      const mockValoracion = mockValoraciones[0];
      service.getValoracionPorId(1).subscribe((valoracion) => {
        expect(valoracion).toEqual(mockValoracion);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/valoraciones/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockValoracion);
    });

    it('should handle valoracion not found', (done) => {
      service.getValoracionPorId(999).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/valoraciones/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle API error for valoracion', (done) => {
      service.getValoracionPorId(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/valoraciones/1`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should fetch valoracion with different ids', (done) => {
      const mockValoracion = mockValoraciones[1];
      service.getValoracionPorId(2).subscribe((valoracion) => {
        expect(valoracion).toEqual(mockValoracion);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/valoraciones/2`);
      req.flush(mockValoracion);
    });
  });
});
