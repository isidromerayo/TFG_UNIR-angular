import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginUsuario } from '../model/login-usuario';
import { UsuarioAuth } from '../model/usuario-auth';
import { API_URL, TOKEN, USER } from '../utils/constants';

describe('AuthenticationService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

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
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send login credentials and store token', (done) => {
      const credentials: LoginUsuario = new LoginUsuario('test@test.com', 'password123');
      const mockToken = 'mock-jwt-token';
      const mockResponse = { id: 1, username: 'test@test.com' };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem(TOKEN)).toBe(mockToken);
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/auth`);
      expect(req.request.method).toBe('POST');
      
      req.flush(mockResponse, {
        status: 200,
        statusText: 'OK',
        headers: { 'Authorization': `Bearer ${mockToken}` }
      });
    });

    it('should handle login error', (done) => {
      const credentials: LoginUsuario = new LoginUsuario('test@test.com', 'wrong');

      service.login(credentials).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(401);
          done();
        }
      );

      const req = httpMock.expectOne(`${API_URL}/auth`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle missing Authorization header', (done) => {
      const credentials: LoginUsuario = new LoginUsuario('test@test.com', 'password123');
      const mockResponse = { id: 1, username: 'test@test.com' };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem(TOKEN)).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/auth`);
      req.flush(mockResponse, {
        status: 200,
        statusText: 'OK',
        headers: {}
      });
    });

    it('should handle null Authorization header', (done) => {
      const credentials: LoginUsuario = new LoginUsuario('test@test.com', 'password123');
      const mockResponse = { id: 1, username: 'test@test.com' };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem(TOKEN)).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/auth`);
      req.flush(mockResponse, {
        status: 200,
        statusText: 'OK'
      });
    });

    it('should handle Authorization header without Bearer prefix', (done) => {
      const credentials: LoginUsuario = new LoginUsuario('test@test.com', 'password123');
      const mockResponse = { id: 1, username: 'test@test.com' };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem(TOKEN)).toBe('token-without-bearer');
        done();
      });

      const req = httpMock.expectOne(`${API_URL}/auth`);
      req.flush(mockResponse, {
        status: 200,
        statusText: 'OK',
        headers: { 'Authorization': 'token-without-bearer' }
      });
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const mockToken = 'test-token-123';
      localStorage.setItem(TOKEN, mockToken);

      const token = service.getToken();
      expect(token).toBe(mockToken);
    });

    it('should return null if no token', () => {
      const token = service.getToken();
      expect(token).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return parsed user from localStorage', () => {
      const mockUser = { id: 1, usuario: 'test@test.com', nombre: 'Test User' };
      localStorage.setItem(USER, JSON.stringify(mockUser));

      const user = service.getUser();
      expect(user).toEqual(mockUser);
    });

    it('should return null if no user in localStorage', () => {
      const user = service.getUser();
      expect(user).toBeNull();
    });

    it('should return null if user is empty string', () => {
      localStorage.setItem(USER, '');

      const user = service.getUser();
      expect(user).toBeNull();
    });

    it('should return null if user JSON is invalid', () => {
      localStorage.setItem(USER, 'invalid-json{');

      const user = service.getUser();
      expect(user).toBeNull();
    });
  });

  describe('register', () => {
    it('should store user data in localStorage', () => {
      const mockAuth: UsuarioAuth = new UsuarioAuth('test@test.com', 'test-token-123', 'Test User', 1);

      service.register(mockAuth);

      expect(localStorage.getItem('isLoggedIn')).toBe('true');
      expect(localStorage.getItem(TOKEN)).toBe(mockAuth.token);
      expect(localStorage.getItem(USER)).toBe(JSON.stringify(mockAuth));
    });
  });

  describe('isLoginUser', () => {
    it('should return true if isLoggedIn is true', () => {
      localStorage.setItem('isLoggedIn', 'true');

      const isLogin = service.isLoginUser();
      expect(isLogin).toBe(true);
    });

    it('should return false if isLoggedIn is false', () => {
      localStorage.setItem('isLoggedIn', 'false');

      const isLogin = service.isLoginUser();
      expect(isLogin).toBe(false);
    });

    it('should return false if isLoggedIn is not set', () => {
      const isLogin = service.isLoginUser();
      expect(isLogin).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user data from localStorage', () => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem(TOKEN, 'test-token');
      localStorage.setItem(USER, JSON.stringify({ id: 1 }));

      service.logout();

      expect(localStorage.getItem('isLoggedIn')).toBe('false');
      expect(localStorage.getItem(TOKEN)).toBeNull();
      expect(localStorage.getItem(USER)).toBeNull();
    });
  });
});
