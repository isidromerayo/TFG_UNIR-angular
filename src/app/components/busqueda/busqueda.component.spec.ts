import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { BusquedaComponent } from './busqueda.component';
import { CursoService } from 'src/app/services/curso.service';

describe('BusquedaComponent', () => {
  let component: BusquedaComponent;
  let fixture: ComponentFixture<BusquedaComponent>;
  let cursoService: jasmine.SpyObj<CursoService>;

  const mockCursos = [
    { id: 1, titulo: 'Angular Basics', precio: 29.99 },
    { id: 2, titulo: 'Advanced Angular', precio: 49.99 }
  ];

  beforeEach(async () => {
    const cursoServiceSpy = jasmine.createSpyObj('CursoService', ['search']);

    await TestBed.configureTestingModule({
      declarations: [BusquedaComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: CursoService, useValue: cursoServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ search: 'Angular' })
          }
        },
        { provide: Router, useValue: {} }
      ]
    }).compileComponents();

    cursoService = TestBed.inject(CursoService) as jasmine.SpyObj<CursoService>;
  });

  describe('initialization success', () => {
    beforeEach(() => {
      cursoService.search.and.returnValue(of(mockCursos));
      fixture = TestBed.createComponent(BusquedaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should search courses on init', () => {
      expect(cursoService.search).toHaveBeenCalledWith('Angular');
      expect(component.cursos).toEqual(mockCursos);
      expect(component.query_string).toBe('Angular');
    });
  });

  describe('initialization error', () => {
    beforeEach(() => {
      spyOn(console, 'error');
      cursoService.search.and.returnValue(throwError(() => new Error('API Error')));
      fixture = TestBed.createComponent(BusquedaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should handle search error', () => {
      expect(cursoService.search).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
      expect(component.cursos).toEqual([]);
    });
  });
});
