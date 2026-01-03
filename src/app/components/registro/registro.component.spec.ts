import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { RegistroComponent } from './registro.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['crear']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, RegistroComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('crearUsuario', () => {
    it('should handle invalid form', () => {
      const alertSpy = spyOn(window, 'alert');
      const form = { form: { status: 'INVALID', reset: jasmine.createSpy('reset') } };

      component.crearUsuario(form);

      expect(alertSpy).toHaveBeenCalledWith('formulario no válido');
      expect(usuarioService.crear).not.toHaveBeenCalled();
    });

    it('should handle successful registration', () => {
      const swalSpy = spyOn(Swal, 'fire');
      usuarioService.crear.and.returnValue(of({ id: 1 }));
      const form = { form: { status: 'VALID', reset: jasmine.createSpy('reset') } };
      
      component.usuario = new Usuario('Test', 'User', 'test@test.com', 'pass');
      component.crearUsuario(form);

      expect(component.submitted).toBeTrue();
      expect(usuarioService.crear).toHaveBeenCalledWith(component.usuario);
      expect(swalSpy).toHaveBeenCalledWith('Alta', jasmine.stringMatching(/registrado.*correctamente/));
      expect(form.form.reset).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/acceso']);
    });

    it('should handle registration error', () => {
      const swalSpy = spyOn(Swal, 'fire');
      spyOn(console, 'dir');
      const errorMsg = 'Email already exists';
      usuarioService.crear.and.returnValue(throwError(() => ({ error: { message: errorMsg } })));
      const form = { form: { status: 'VALID', reset: jasmine.createSpy('reset') } };

      component.usuario = new Usuario('Test', 'User', 'test@test.com', 'pass');
      component.crearUsuario(form);

      expect(component.submitted).toBeTrue();
      expect(usuarioService.crear).toHaveBeenCalled();
      expect(console.dir).toHaveBeenCalledWith(errorMsg);
      expect(swalSpy).toHaveBeenCalledWith('Alta de usuario', jasmine.stringMatching(/problemas/), 'error');
    });
  });

  it('should reset form', () => {
    const form = { form: { reset: jasmine.createSpy('reset') } };
    component.onReset(form);
    expect(form.form.reset).toHaveBeenCalled();
  });
});