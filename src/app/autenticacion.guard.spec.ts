import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AutenticacionGuard } from './autenticacion.guard';

describe('AutenticacionGuard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    });
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow access when token exists', () => {
    localStorage.setItem('token', 'valid-token-123');

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => AutenticacionGuard(route, state));

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect when token does not exist', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => AutenticacionGuard(route, state));

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/acceso']);
  });

  it('should allow access with different valid tokens', () => {
    const tokens = ['token-abc', 'token-xyz', 'jwt-token-123'];

    tokens.forEach((token) => {
      localStorage.clear();
      (router.navigate as jasmine.Spy).calls.reset();
      localStorage.setItem('token', token);

      const route = {} as ActivatedRouteSnapshot;
      const state = { url: '/some-route' } as RouterStateSnapshot;

      const result = TestBed.runInInjectionContext(() => AutenticacionGuard(route, state));

      expect(result).toBe(true);
    });
  });

  it('should redirect to acceso route on unauthorized access', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/admin' } as RouterStateSnapshot;

    TestBed.runInInjectionContext(() => AutenticacionGuard(route, state));

    expect(router.navigate).toHaveBeenCalledWith(['/acceso']);
  });

  it('should allow access with empty token string', () => {
    localStorage.setItem('token', '');

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => AutenticacionGuard(route, state));

    expect(result).toBe(true);
  });
});
