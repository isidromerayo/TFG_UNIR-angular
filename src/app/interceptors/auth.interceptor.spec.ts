import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { authInterceptor, esRutaPublica } from './auth.interceptor';
import { API_URL, TOKEN } from '../utils/constants';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  function expectHeader(url: string, method: 'GET' | 'POST', header: string | null): void {
    const subscription = (method === 'GET' ? http.get(url) : http.post(url, {}))
      .subscribe({ next: () => undefined, error: () => undefined });
    const match = httpMock.expectOne(url);
    expect(match.request.headers.get('Authorization')).toBe(header);
    match.flush({});
    subscription.unsubscribe();
  }

  it('should add the Bearer header to protected routes when a token exists', () => {
    localStorage.setItem(TOKEN, 'jwt-token');
    expectHeader(`${API_URL}/usuarios/1/cursos`, 'GET', 'Bearer jwt-token');
  });

  it('should add the Bearer header to purchase calls', () => {
    localStorage.setItem(TOKEN, 'jwt-token');
    expectHeader(`${API_URL}/usuarios/2/misCursosComprados`, 'POST', 'Bearer jwt-token');
  });

  it('should not add the header when there is no token', () => {
    expectHeader(`${API_URL}/usuarios/1/cursos`, 'GET', null);
  });

  it("should ignore the legacy 'undefined' token", () => {
    localStorage.setItem(TOKEN, 'undefined');
    expectHeader(`${API_URL}/usuarios/1/cursos`, 'GET', null);
  });

  it('should not add the header to the login POST', () => {
    localStorage.setItem(TOKEN, 'jwt-token');
    expectHeader(`${API_URL}/auth`, 'POST', null);
  });

  it('should not add the header to the signup POST', () => {
    localStorage.setItem(TOKEN, 'jwt-token');
    expectHeader(`${API_URL}/usuarios`, 'POST', null);
  });

  it('should not add the header to public catalog GETs', () => {
    localStorage.setItem(TOKEN, 'jwt-token');
    expectHeader(`${API_URL}/categorias?sort=nombre`, 'GET', null);
    expectHeader(`${API_URL}/cursos/1`, 'GET', null);
    expectHeader(`${API_URL}/valoraciones/3`, 'GET', null);
  });
});

describe('esRutaPublica', () => {
  it('classifies login and signup POSTs as public', () => {
    expect(esRutaPublica({ url: `${API_URL}/auth`, method: 'POST' })).toBeTrue();
    expect(esRutaPublica({ url: `${API_URL}/usuarios`, method: 'POST' })).toBeTrue();
  });

  it('classifies catalog GETs as public', () => {
    expect(esRutaPublica({ url: `${API_URL}/categorias`, method: 'GET' })).toBeTrue();
    expect(esRutaPublica({ url: `${API_URL}/cursos/search/findByTituloContaining?titulo=x`, method: 'GET' })).toBeTrue();
  });

  it('classifies user-scoped routes as protected', () => {
    expect(esRutaPublica({ url: `${API_URL}/usuarios/1/cursos`, method: 'GET' })).toBeFalse();
    expect(esRutaPublica({ url: `${API_URL}/usuarios/1/misCursosComprados`, method: 'POST' })).toBeFalse();
  });
});
