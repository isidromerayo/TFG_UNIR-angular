import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import Swal from 'sweetalert2';

import { sesionInterceptor } from './sesion.interceptor';
import { AuthService } from '../services/auth.service';
import { API_URL, TOKEN, USER } from '../utils/constants';

describe('sesionInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: { navigate: jasmine.Spy };
  let swalSpy: jasmine.Spy;

  beforeEach(() => {
    router = { navigate: jasmine.createSpy('navigate') };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([sesionInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router }
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    swalSpy = spyOn(Swal, 'fire').and.stub();
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  function loginWithSession(): void {
    localStorage.setItem(TOKEN, 'jwt-token');
    localStorage.setItem(USER, JSON.stringify({ id: 1 }));
    localStorage.setItem('isLoggedIn', 'true');
  }

  it('should close the session and redirect on 401 in a protected route', () => {
    loginWithSession();
    let errorStatus: number | undefined;
    http.get(`${API_URL}/usuarios/1/cursos`)
      .subscribe({ next: () => undefined, error: (err) => (errorStatus = err.status) });

    httpMock.expectOne(`${API_URL}/usuarios/1/cursos`).flush('expired', { status: 401, statusText: 'Unauthorized' });

    expect(errorStatus).toBe(401);
    expect(localStorage.getItem(TOKEN)).toBeNull();
    expect(localStorage.getItem(USER)).toBeNull();
    expect(swalSpy).toHaveBeenCalledWith('Sesión caducada', 'Su sesión ha expirado, vuelva a acceder', 'warning');
    expect(router.navigate).toHaveBeenCalledWith(['/acceso']);
  });

  it('should let the login 401 through without closing anything', () => {
    let errorStatus: number | undefined;
    http.post(`${API_URL}/auth`, { email: 'a@b.c', password: 'x' })
      .subscribe({ next: () => undefined, error: (err) => (errorStatus = err.status) });

    httpMock.expectOne(`${API_URL}/auth`).flush('bad credentials', { status: 401, statusText: 'Unauthorized' });

    expect(errorStatus).toBe(401);
    expect(swalSpy).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should report 403 without logging out', () => {
    loginWithSession();
    const auth = TestBed.inject(AuthService);
    spyOn(auth, 'logout').and.callThrough();
    http.get(`${API_URL}/usuarios/2/cursos`)
      .subscribe({ next: () => undefined, error: () => undefined });

    httpMock.expectOne(`${API_URL}/usuarios/2/cursos`).flush('forbidden', { status: 403, statusText: 'Forbidden' });

    expect(swalSpy).toHaveBeenCalledWith('Sin permisos', 'No tiene permiso para ver estos datos', 'error');
    expect(auth.logout).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not interfere with successful responses', () => {
    let body: unknown;
    http.get(`${API_URL}/usuarios/1/cursos`).subscribe((res) => (body = res));

    httpMock.expectOne(`${API_URL}/usuarios/1/cursos`).flush([]);

    expect(body).toEqual([]);
    expect(swalSpy).not.toHaveBeenCalled();
  });
});
