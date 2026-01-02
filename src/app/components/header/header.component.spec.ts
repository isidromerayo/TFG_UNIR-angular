import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { HomeService } from 'src/app/services/home.service';
import { AuthService } from 'src/app/services/auth.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockHomeService: jasmine.SpyObj<HomeService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockHomeService = jasmine.createSpyObj('HomeService', ['getCategoriasPortada']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);

    mockHomeService.getCategoriasPortada.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: HomeService, useValue: mockHomeService },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty categorias array', () => {
    expect(component.categorias).toEqual([]);
  });

  it('should call getCategoriasPortada on initialization', () => {
    expect(mockHomeService.getCategoriasPortada).toHaveBeenCalled();
  });

  it('should return false when user is not logged in', () => {
    localStorage.removeItem('isLoggedIn');
    expect(component.isLogin()).toBeFalse();
  });

  it('should return true when user is logged in', () => {
    localStorage.setItem('isLoggedIn', 'true');
    expect(component.isLogin()).toBeTrue();
    localStorage.removeItem('isLoggedIn');
  });
});
