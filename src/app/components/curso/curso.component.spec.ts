import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoService } from '../../services/carrito.service';
import { CursoService } from '../../services/curso.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CursoComponent } from './curso.component';

describe('CursoComponent', () => {
  let component: CursoComponent;
  let fixture: ComponentFixture<CursoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CursoComponent],
      providers: [
        { provide: CarritoService, useValue: { addCurso: jasmine.createSpy('addCurso') } },
        { provide: CursoService, useValue: {} },
        { provide: ActivatedRoute, useValue: { params: { subscribe: () => {} } } },
        { provide: Router, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(CursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a Swal.fire al añadir un curso al carrito', () => {
    const swalSpy = spyOn(Swal, 'fire');
    const curso = { id: 1, titulo: 'Curso Test' };
    component.addCarritoCurso(curso);
    expect(swalSpy).toHaveBeenCalledWith('Carrito','Curso añadido correctamente');
  });
});
