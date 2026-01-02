import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { HomeService } from 'src/app/services/home.service';
import { AuthService } from 'src/app/services/auth.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let homeService: jasmine.SpyObj<HomeService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockCategorias = [
    { id: 1, nombre: 'Angular' },
    { id: 2, nombre: 'React' },
    { id: 3, nombre: 'Vue' }
  ];

  beforeEach(async () => {
    const homeServiceSpy = jasmine.createSpyObj('HomeService', ['getCategoriasPortada']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    homeServiceSpy.getCategoriasPortada.and.returnValue(of(mockCategorias));

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: HomeService, useValue: homeServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    homeService = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isLogin', () => {
    it('should return true when isLoggedIn is true', () => {
      localStorage.setItem('isLoggedIn', 'true');

      const result = component.isLogin();

      expect(result).toBe(true);
    });

    it('should return false when isLoggedIn is false', () => {
      localStorage.setItem('isLoggedIn', 'false');

      const result = component.isLogin();

      expect(result).toBe(false);
    });

    it('should return false when isLoggedIn is not set', () => {
      const result = component.isLogin();

      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('should call authService logout', () => {
      component.logout();

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should navigate to home after logout', () => {
      component.logout();

      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });
  });
});
