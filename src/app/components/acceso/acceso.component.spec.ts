import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

import { AccesoComponent } from './acceso.component';

describe('AccesoComponent', () => {
  let component: AccesoComponent;
  let fixture: ComponentFixture<AccesoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccesoComponent],
      providers: [
        { provide: AuthService, useValue: { login: () => ({ subscribe: (callbacks: any) => callbacks.next({ token: 'fake-token' }) }), register: () => {} } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    });
    fixture = TestBed.createComponent(AccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a Swal.fire al loguear correctamente', () => {
    const swalSpy = spyOn(Swal, 'fire');
    component.loginUsuario();
    expect(swalSpy).toHaveBeenCalledWith('Acceso','Logeado correctamente');
  });
});
