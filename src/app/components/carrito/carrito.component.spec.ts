import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CarritoComponent } from './carrito.component';

describe('CarritoComponent', () => {
  let component: CarritoComponent;
  let fixture: ComponentFixture<CarritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CarritoComponent],
      providers: [
        { provide: CarritoService, useValue: { clean: jasmine.createSpy('clean'), myCart$: { subscribe: () => {} }, isEmpty: () => true, totalCart: () => 0, deleteCurso: () => {} } },
        { provide: AuthService, useValue: { isLoginUser: () => false } },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    });
    fixture = TestBed.createComponent(CarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a Swal.fire cuando el usuario no está logueado al comprar', () => {
    const swalSpy = spyOn(Swal, 'fire');
    component.comprar();
    expect(swalSpy).toHaveBeenCalledWith('Compra','Debe estar logeado para realizar la compra');
  });
});
