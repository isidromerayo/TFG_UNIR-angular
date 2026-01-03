import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { CarritoService } from './carrito.service';
import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { API_URL } from '../utils/constants';

describe('CarritoService', () => {
  let service: CarritoService;
  let authService: AuthService;
  let httpMock: HttpTestingController;

  const mockCurso1 = { id: 1, titulo: 'Angular Basics', precio: 29.99 };
  const mockCurso2 = { id: 2, titulo: 'Advanced Angular', precio: 49.99 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [],
      providers: [
        CarritoService,
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CarritoService);
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addCurso', () => {
    it('should add first curso to cart', (done) => {
      service.myCart$.subscribe((cart) => {
        if (cart.length > 0) {
          expect(cart).toContain(mockCurso1);
          done();
        }
      });

      service.addCurso(mockCurso1);
    });

    it('should add multiple cursos to cart', (done) => {
      service.addCurso(mockCurso1);
      service.myCart$.subscribe((cart) => {
        if (cart.length === 2) {
          expect(cart).toContain(mockCurso1);
          expect(cart).toContain(mockCurso2);
          done();
        }
      });

      service.addCurso(mockCurso2);
    });

    it('should not add duplicate curso', (done) => {
      service.addCurso(mockCurso1);
      service.addCurso(mockCurso1);

      service.myCart$.subscribe((cart) => {
        if (cart.length > 0) {
          expect(cart.length).toBe(1);
          done();
        }
      });
    });
  });

  describe('deleteCurso', () => {
    it('should remove curso from cart', (done) => {
      service.addCurso(mockCurso1);
      service.addCurso(mockCurso2);
      
      service.deleteCurso(1);

      service.myCart$.subscribe((cart) => {
        if (cart.length === 1) {
          expect(cart).not.toContain(mockCurso1);
          expect(cart).toContain(mockCurso2);
          done();
        }
      });
    });

    it('should handle deleting non-existent curso', (done) => {
      service.addCurso(mockCurso1);
      
      service.deleteCurso(999);

      service.myCart$.subscribe((cart) => {
        if (cart.length > 0) {
          expect(cart.length).toBe(1);
          done();
        }
      });
    });
  });

  describe('totalCart', () => {
    it('should calculate total price of cart', () => {
      service.addCurso(mockCurso1);
      service.addCurso(mockCurso2);

      const total = service.totalCart();
      expect(total).toBe(79.98);
    });

    it('should return 0 for empty cart', () => {
      const total = service.totalCart();
      expect(total).toBe(0);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty cart', () => {
      expect(service.isEmpty()).toBe(true);
    });

    it('should return false when cart has items', () => {
      service.addCurso(mockCurso1);
      expect(service.isEmpty()).toBe(false);
    });
  });

  describe('hasItems', () => {
    it('should return false for empty cart', () => {
      expect(service.hasItems()).toBe(false);
    });

    it('should return true when cart has items', () => {
      service.addCurso(mockCurso1);
      expect(service.hasItems()).toBe(true);
    });

    it('should return true when cart has multiple items', () => {
      service.addCurso(mockCurso1);
      service.addCurso(mockCurso2);
      expect(service.hasItems()).toBe(true);
    });

    it('should return false after cleaning cart', () => {
      service.addCurso(mockCurso1);
      service.clean();
      expect(service.hasItems()).toBe(false);
    });
  });

  describe('clean', () => {
    it('should clear all items from cart', (done) => {
      service.addCurso(mockCurso1);
      service.addCurso(mockCurso2);
      
      service.clean();

      service.myCart$.subscribe((cart) => {
        if (cart.length === 0) {
          expect(cart).toEqual([]);
          done();
        }
      });
    });
  });

  describe('comprarCursos', () => {
    it('should send purchase request with correct data', () => {
      const mockUser = { id: 1, usuario: 'test@test.com' };
      spyOn(authService, 'getUser').and.returnValue(mockUser);

      const cursos = [mockCurso1, mockCurso2];
      service.comprarCursos(cursos).subscribe();

      const req = httpMock.expectOne(`${API_URL}/usuarios/1/misCursosComprados`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual([
        `${API_URL}/cursos/1`,
        `${API_URL}/cursos/2`
      ]);
      req.flush({ success: true });
    });

    it('should handle error when user not logged in', (done) => {
      spyOn(authService, 'getUser').and.returnValue(null);

      service.comprarCursos([mockCurso1]).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.message).toBe('User not logged in or user ID not found.');
          done();
        }
      );
    });

    it('should handle error when user id not available', (done) => {
      const mockUser = { usuario: 'test@test.com' };
      spyOn(authService, 'getUser').and.returnValue(mockUser);

      service.comprarCursos([mockCurso1]).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.message).toBe('User not logged in or user ID not found.');
          done();
        }
      );
    });
  });
});
