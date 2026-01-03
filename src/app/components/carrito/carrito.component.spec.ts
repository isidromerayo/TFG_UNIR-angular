import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { CarritoComponent } from './carrito.component';

describe('CarritoComponent', () => {
  let component: CarritoComponent;
  let fixture: ComponentFixture<CarritoComponent>;
  let carritoService: jasmine.SpyObj<CarritoService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockCursos = [
    { id: 1, titulo: 'Curso 1', precio: 29.99 },
    { id: 2, titulo: 'Curso 2', precio: 49.99 }
  ];

  beforeEach(() => {
    const carritoServiceSpy = jasmine.createSpyObj('CarritoService', ['clean', 'isEmpty', 'totalCart', 'deleteCurso', 'hasItems', 'comprarCursos']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoginUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    carritoServiceSpy.myCart$ = of(mockCursos);

    TestBed.configureTestingModule({
      imports: [CarritoComponent],
      providers: [
        { provide: CarritoService, useValue: carritoServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(CarritoComponent);
    component = fixture.componentInstance;
    carritoService = TestBed.inject(CarritoService) as jasmine.SpyObj<CarritoService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a Swal.fire cuando el usuario no está logueado al comprar', () => {
    const swalSpy = spyOn(Swal, 'fire');
    authService.isLoginUser.and.returnValue(false);
    
    component.comprar();
    
    expect(swalSpy).toHaveBeenCalledWith('Compra','Debe estar logeado para realizar la compra');
    expect(router.navigate).toHaveBeenCalledWith(['/acceso']);
  });

  it('debería mostrar alerta cuando el carrito está vacío y usuario está logueado', () => {
    const swalSpy = spyOn(Swal, 'fire');
    authService.isLoginUser.and.returnValue(true);
    carritoService.hasItems.and.returnValue(false);
    
    component.comprar();
    
    expect(swalSpy).toHaveBeenCalledWith('Compra','El carrito está vacío');
    expect(carritoService.hasItems).toHaveBeenCalled();
  });

  it('debería procesar compra correctamente cuando usuario está logueado y carrito tiene items', () => {
    const swalSpy = spyOn(Swal, 'fire');
    authService.isLoginUser.and.returnValue(true);
    carritoService.hasItems.and.returnValue(true);
    carritoService.comprarCursos.and.returnValue(of({ success: true }));
    
    // Mock Swal.fire to return { isConfirmed: true }
    swalSpy.and.returnValue(Promise.resolve({ 
      isConfirmed: true,
      isDenied: false,
      isDismissed: false
    } as any));
    
    component.comprar();
    
    expect(carritoService.hasItems).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      title: '¿Estas seguro de realizar la compra?',
      text: "No se puede deshacer",
      icon: "question",
      showCancelButton: true,
      focusCancel: true
    }));
  });

  it('debería cancelar compra cuando usuario no confirma', () => {
    const swalSpy = spyOn(Swal, 'fire');
    authService.isLoginUser.and.returnValue(true);
    carritoService.hasItems.and.returnValue(true);
    
    // Mock Swal.fire to return { isConfirmed: false }
    swalSpy.and.returnValue(Promise.resolve({ 
      isConfirmed: false,
      isDenied: false,
      isDismissed: false
    } as any));
    
    component.comprar();
    
    expect(carritoService.hasItems).toHaveBeenCalled();
    expect(carritoService.comprarCursos).not.toHaveBeenCalled();
  });
});
