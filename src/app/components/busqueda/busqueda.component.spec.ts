import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
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
      imports: [BusquedaComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CursoService, useValue: cursoServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ search: 'Angular' })
          }
        }
      ]
    }).compileComponents();

    cursoService = TestBed.inject(CursoService) as jasmine.SpyObj<CursoService>;
  });

  describe('initialization success', () => {
    beforeEach(() => {
      spyOn(console, 'log'); // Suppress console.log
      cursoService.search.and.returnValue(of(mockCursos));
      fixture = TestBed.createComponent(BusquedaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should implement OnInit', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should search courses on init', () => {
      expect(cursoService.search).toHaveBeenCalledWith('Angular');
      expect(component.cursos).toEqual(mockCursos);
      expect(component.query_string).toBe('Angular');
    });

    it('should handle empty search results', () => {
      cursoService.search.and.returnValue(of([]));
      
      fixture = TestBed.createComponent(BusquedaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.cursos).toEqual([]);
      expect(component.query_string).toBe('Angular');
    });
  });

  describe('initialization error', () => {
    beforeEach(() => {
      cursoService.search.and.returnValue(throwError(() => new Error('API Error')));
      spyOn(console, 'error'); // Suppress console.error for error handling tests
      fixture = TestBed.createComponent(BusquedaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should handle search error', () => {
      expect(cursoService.search).toHaveBeenCalled();
      expect(component.cursos).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('additional scenarios', () => {
    it('should handle empty search results', () => {
      spyOn(console, 'log'); // Suppress console.log
      cursoService.search.and.returnValue(of([]));
      
      fixture = TestBed.createComponent(BusquedaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.cursos).toEqual([]);
    });

    it('should handle network error gracefully', () => {
      spyOn(console, 'log'); // Suppress console.log
      spyOn(console, 'error'); // Suppress console.error
      cursoService.search.and.returnValue(throwError(() => new Error('Network timeout')));
      
      fixture = TestBed.createComponent(BusquedaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(console.error).toHaveBeenCalled();
      expect(component.cursos).toEqual([]);
    });

    it('should handle null results', () => {
      spyOn(console, 'log'); // Suppress console.log
      cursoService.search.and.returnValue(of(null));
      
      fixture = TestBed.createComponent(BusquedaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.cursos).toBeNull();
    });
  });
});