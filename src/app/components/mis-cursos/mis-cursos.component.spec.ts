import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { MisCursosComponent } from './mis-cursos.component';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

describe('MisCursosComponent', () => {
  let component: MisCursosComponent;
  let fixture: ComponentFixture<MisCursosComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;

  const mockUser = { id: 1, usuario: 'test@test.com', nombre: 'Test User' };
  const mockCursos = [
    { id: 1, titulo: 'Angular Basics', precio: 29.99 },
    { id: 2, titulo: 'Advanced Angular', precio: 49.99 }
  ];

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['getCursos']);

    await TestBed.configureTestingModule({
      imports: [MisCursosComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      authService.getUser.and.returnValue(mockUser);
      usuarioService.getCursos.and.returnValue(of(mockCursos));
      
      fixture = TestBed.createComponent(MisCursosComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load user courses on init', () => {
      expect(authService.getUser).toHaveBeenCalled();
      expect(usuarioService.getCursos).toHaveBeenCalledWith(mockUser.id);
      expect(component.cursos).toEqual(mockCursos);
    });
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      authService.getUser.and.returnValue(null);
      
      fixture = TestBed.createComponent(MisCursosComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should not load courses', () => {
      expect(authService.getUser).toHaveBeenCalled();
      expect(usuarioService.getCursos).not.toHaveBeenCalled();
      expect(component.cursos).toEqual([]);
    });
  });
});
