import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { ValoracionService } from './valoracion.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { API_URL } from '../utils/constants';

describe('ValoracionService', () => {
  let service: ValoracionService;
  let httpMock: HttpTestingController;

  const mockValoracion = {
    id: 1,
    puntuacion: 5,
    comentario: 'Excelente curso',
    usuario: 'user1',
    curso: 1
  };

  const mockCurso = {
    id: 1,
    titulo: 'Angular Basics',
    descripcion: 'Learn Angular fundamentals',
    precio: 29.99
  };

  const mockUsuario = {
    id: 1,
    usuario: 'test@test.com',
    nombre: 'Test User'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [],
      providers: [
        ValoracionService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ValoracionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getValoracionPorId', () => {
    it('should fetch valoracion by id', (done) => {
      service.getValoracionPorId(1).subscribe((valoracion) => {
        expect(valoracion).toEqual(mockValoracion);
        expect(valoracion.id).toBe(1);
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

    it('should handle API error', (done) => {
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

    it('should handle network error', (done) => {
      service.getValoracionPorId(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.error.type).toBe('Network error');
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/valoraciones/1`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should fetch different valoraciones by id', (done) => {
      const valoracion2 = { id: 2, puntuacion: 4, comentario: 'Muy bueno', usuario: 'user2' };
      service.getValoracionPorId(2).subscribe((valoracion) => {
        expect(valoracion).toEqual(valoracion2);
        expect(valoracion.id).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/valoraciones/2`);
      req.flush(valoracion2);
    });
  });

  describe('getValoracionPorIdCurso', () => {
    it('should fetch course for a valoracion', (done) => {
      service.getValoracionPorIdCurso(1).subscribe((curso) => {
        expect(curso).toEqual(mockCurso);
        expect(curso.id).toBe(1);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/valoraciones/1/curso`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCurso);
    });

    it('should handle valoracion not found', (done) => {
      service.getValoracionPorIdCurso(999).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/valoraciones/999/curso`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle API error', (done) => {
      service.getValoracionPorIdCurso(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/valoraciones/1/curso`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', (done) => {
      service.getValoracionPorIdCurso(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.error.type).toBe('Network error');
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/valoraciones/1/curso`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should fetch course for different valoraciones', (done) => {
      const curso2 = { id: 2, titulo: 'React Basics', precio: 29.99 };
      service.getValoracionPorIdCurso(2).subscribe((curso) => {
        expect(curso).toEqual(curso2);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/valoraciones/2/curso`);
      req.flush(curso2);
    });
  });

  describe('getValoracionPorIdUsuario', () => {
    it('should fetch user for a valoracion', (done) => {
      service.getValoracionPorIdUsuario(1).subscribe((usuario) => {
        expect(usuario).toEqual(mockUsuario);
        expect(usuario.id).toBe(1);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/valoraciones/1/estudiante`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);
    });

    it('should handle valoracion not found', (done) => {
      service.getValoracionPorIdUsuario(999).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/valoraciones/999/estudiante`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle API error', (done) => {
      service.getValoracionPorIdUsuario(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/valoraciones/1/estudiante`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', (done) => {
      service.getValoracionPorIdUsuario(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.error.type).toBe('Network error');
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/valoraciones/1/estudiante`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should fetch user for different valoraciones', (done) => {
      const usuario2 = { id: 2, usuario: 'user2@test.com', nombre: 'User Two' };
      service.getValoracionPorIdUsuario(2).subscribe((usuario) => {
        expect(usuario).toEqual(usuario2);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/valoraciones/2/estudiante`);
      req.flush(usuario2);
    });

    it('should handle unauthorized access', (done) => {
      service.getValoracionPorIdUsuario(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(403);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/valoraciones/1/estudiante`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });
});
