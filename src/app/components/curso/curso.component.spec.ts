import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { CursoComponent } from './curso.component';
import { CursoService } from 'src/app/services/curso.service';
import { CarritoService } from 'src/app/services/carrito.service';

describe('CursoComponent', () => {
  let component: CursoComponent;
  let fixture: ComponentFixture<CursoComponent>;
  let cursoService: jasmine.SpyObj<CursoService>;
  let carritoService: jasmine.SpyObj<CarritoService>;

  const mockCurso = {
    id: 1,
    titulo: 'Angular Basics',
    descripcion: 'Learn Angular',
    precio: 29.99,
    imagen: 'angular.jpg'
  };

  beforeEach(async () => {
    const cursoServiceSpy = jasmine.createSpyObj('CursoService', ['getCursoPorId']);
    const carritoServiceSpy = jasmine.createSpyObj('CarritoService', ['addCurso']);

    await TestBed.configureTestingModule({
      declarations: [CursoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: CursoService, useValue: cursoServiceSpy },
        { provide: CarritoService, useValue: carritoServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 })
          }
        },
        { provide: Router, useValue: {} }
      ]
    }).compileComponents();

    cursoService = TestBed.inject(CursoService) as jasmine.SpyObj<CursoService>;
    carritoService = TestBed.inject(CarritoService) as jasmine.SpyObj<CarritoService>;
  });

  describe('initialization success', () => {
    beforeEach(() => {
      cursoService.getCursoPorId.and.returnValue(of(mockCurso));
      fixture = TestBed.createComponent(CursoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load course details on init', () => {
      expect(cursoService.getCursoPorId).toHaveBeenCalledWith(1);
      expect(component.curso).toEqual(mockCurso);
    });
  });

  describe('initialization error', () => {
    beforeEach(() => {
      spyOn(console, 'error');
      cursoService.getCursoPorId.and.returnValue(throwError(() => new Error('API Error')));
      fixture = TestBed.createComponent(CursoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should handle error when loading course fails', () => {
      expect(cursoService.getCursoPorId).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('functionality', () => {
    beforeEach(() => {
      cursoService.getCursoPorId.and.returnValue(of(mockCurso));
      fixture = TestBed.createComponent(CursoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should add course to cart and show alert', () => {
      const swalSpy = spyOn(Swal, 'fire');
      
      component.addCarritoCurso(mockCurso);

      expect(carritoService.addCurso).toHaveBeenCalledWith(mockCurso);
      expect(swalSpy).toHaveBeenCalledWith('Carrito', 'Curso añadido correctamente');
    });
  });
});
