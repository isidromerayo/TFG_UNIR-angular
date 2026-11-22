import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { AccesoComponent } from './acceso.component';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioAuth } from 'src/app/model/usuario-auth';

describe('AccesoComponent', () => {
  let component: AccesoComponent;
  let fixture: ComponentFixture<AccesoComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockUsuarioAuth: UsuarioAuth = {
    id: 1,
    token: 'fake-token',
    username: 'test@test.com',
    fullname: 'Test User'
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, AccesoComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loginUsuario', () => {
    it('should handle successful login', () => {
      const swalSpy = spyOn(Swal, 'fire');
      authService.login.and.returnValue(of(mockUsuarioAuth));
      
      component.login_usuario = { email: 'test@test.com', password: 'password' };
      component.loginUsuario();

      expect(authService.login).toHaveBeenCalledWith(component.login_usuario);
      expect(component.usuario_auth).toEqual(mockUsuarioAuth);
      expect(authService.register).toHaveBeenCalledWith(mockUsuarioAuth);
      expect(swalSpy).toHaveBeenCalledWith('Acceso', 'Logeado correctamente');
      expect(router.navigate).toHaveBeenCalledWith(['/mis-cursos']);
    });

    it('should handle login error', () => {
      const swalSpy = spyOn(Swal, 'fire');
      authService.login.and.returnValue(throwError(() => new Error('Login failed')));

      component.login_usuario = { email: 'test@test.com', password: 'wrong-password' };
      component.loginUsuario();

      expect(authService.login).toHaveBeenCalled();
      expect(swalSpy).toHaveBeenCalledWith('Problemas acceso', 'No se ha podido logear, revise usuario/contraseña', 'error');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should show a credentials message on 401', () => {
      const swalSpy = spyOn(Swal, 'fire');
      authService.login.and.returnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

      component.loginUsuario();

      expect(swalSpy).toHaveBeenCalledWith('Problemas acceso', 'No se ha podido logear, revise usuario/contraseña', 'error');
    });

    it('should show the Retry-After wait on 429', () => {
      const swalSpy = spyOn(Swal, 'fire');
      const err = new HttpErrorResponse({ status: 429, headers: new HttpHeaders({ 'Retry-After': '30' }) });
      authService.login.and.returnValue(throwError(() => err));

      component.loginUsuario();

      expect(swalSpy).toHaveBeenCalledWith(
        'Problemas acceso',
        'Demasiados intentos seguidos, vuelva a intentarlo en 30 segundos',
        'error'
      );
    });
  });
});