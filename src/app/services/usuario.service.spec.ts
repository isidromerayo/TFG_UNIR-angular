import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { UsuarioService } from './usuario.service';
import { Usuario } from '../model/usuario';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { API_URL } from '../utils/constants';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  const mockUsuario: Usuario = new Usuario(
    'Test User',
    'Test Apellido',
    'test@test.com',
    'password123'
  );

  const mockUsuarioResponse = {
    id: 1,
    usuario: 'test@test.com',
    nombre: 'Test User'
  };

  const mockCursos = [
    { id: 1, titulo: 'Angular Basics', precio: 29.99 },
    { id: 2, titulo: 'Advanced Angular', precio: 49.99 },
    { id: 3, titulo: 'Angular Testing', precio: 39.99 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [],
      providers: [
        UsuarioService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('crear', () => {
    it('should create a new user', (done) => {
      service.crear(mockUsuario).subscribe((response) => {
        expect(response).toEqual(mockUsuarioResponse);
        expect(response.id).toBe(1);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/usuarios`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUsuario);
      req.flush(mockUsuarioResponse);
    });

    it('should handle validation error on user creation', (done) => {
      service.crear(mockUsuario).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(400);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/usuarios`);
      req.flush('Invalid user data', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle duplicate user error', (done) => {
      service.crear(mockUsuario).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(409);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/usuarios`);
      req.flush('User already exists', { status: 409, statusText: 'Conflict' });
    });

    it('should handle server error on user creation', (done) => {
      service.crear(mockUsuario).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/usuarios`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error on user creation', (done) => {
      service.crear(mockUsuario).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.error.type).toBe('Network error');
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/usuarios`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should send correct user data in request body', (done) => {
      const newUsuario = new Usuario(
        'New User',
        'New Apellido',
        'newuser@test.com',
        'pass123'
      );

      service.crear(newUsuario).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/usuarios`);
      expect(req.request.body.email).toBe('newuser@test.com');
      expect(req.request.body.nombre).toBe('New User');
      req.flush(mockUsuarioResponse);
    });
  });

  describe('getCursos', () => {
    it('should fetch user courses', (done) => {
      service.getCursos(1).subscribe((response) => {
        expect(response).toEqual(mockCursos);
        expect(response.length).toBe(3);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/usuarios/1/cursos`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCursos);
    });

    it('should handle user not found', (done) => {
      service.getCursos(999).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/usuarios/999/cursos`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle empty courses list', (done) => {
      service.getCursos(1).subscribe((response) => {
        expect(response).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/usuarios/1/cursos`);
      req.flush([]);
    });

    it('should handle server error', (done) => {
      service.getCursos(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/usuarios/1/cursos`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network error', (done) => {
      service.getCursos(1).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.error.type).toBe('Network error');
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/usuarios/1/cursos`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should fetch courses for different users', (done) => {
      const userCursos = [
        { id: 4, titulo: 'React Basics', precio: 29.99 }
      ];
      service.getCursos(2).subscribe((response) => {
        expect(response).toEqual(userCursos);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/usuarios/2/cursos`);
      req.flush(userCursos);
    });
  });
});
