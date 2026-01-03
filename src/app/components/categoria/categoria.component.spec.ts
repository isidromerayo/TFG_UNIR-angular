import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { CategoriaComponent } from './categoria.component';
import { CategoriaService } from 'src/app/services/categoria.service';

describe('CategoriaComponent', () => {
  let component: CategoriaComponent;
  let fixture: ComponentFixture<CategoriaComponent>;
  let mockCategoriaService: jasmine.SpyObj<CategoriaService>;

  const mockCategoria = {
    id: 1,
    nombre: 'Angular',
    descripcion: 'Cursos de Angular'
  };

  const mockCursos = [
    { id: 1, titulo: 'Angular Basics', precio: 29.99 },
    { id: 2, titulo: 'Advanced Angular', precio: 49.99 }
  ];

  beforeEach(() => {
    mockCategoriaService = jasmine.createSpyObj('CategoriaService', ['getCategoriaId', 'getCategoriaIdCursos']);
    mockCategoriaService.getCategoriaId.and.returnValue(of(mockCategoria));
    mockCategoriaService.getCategoriaIdCursos.and.returnValue(of(mockCursos));

    TestBed.configureTestingModule({
      imports: [CategoriaComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: CategoriaService, useValue: mockCategoriaService }
      ]
    });
    fixture = TestBed.createComponent(CategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should implement OnInit', () => {
    expect(component.ngOnInit).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should load categoria and cursos on init', () => {
      expect(mockCategoriaService.getCategoriaId).toHaveBeenCalled();
      expect(mockCategoriaService.getCategoriaIdCursos).toHaveBeenCalled();
      expect(component.categoria).toEqual(mockCategoria);
      expect(component.categoria_cursos).toEqual(mockCursos);
    });

    it('should handle categoria service error', () => {
      mockCategoriaService.getCategoriaId.and.returnValue(throwError(() => new Error('API Error')));
      mockCategoriaService.getCategoriaIdCursos.and.returnValue(of(mockCursos));
      
      // Spy on console.error to prevent test failure
      spyOn(console, 'error');
      
      fixture = TestBed.createComponent(CategoriaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(console.error).toHaveBeenCalled();
      expect(component.categoria).toEqual({});
      expect(component.categoria_cursos).toEqual(mockCursos);
    });

    it('should handle cursos service error', () => {
      mockCategoriaService.getCategoriaId.and.returnValue(of(mockCategoria));
      mockCategoriaService.getCategoriaIdCursos.and.returnValue(throwError(() => new Error('API Error')));
      
      // Spy on console.error to prevent test failure
      spyOn(console, 'error');
      
      fixture = TestBed.createComponent(CategoriaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(console.error).toHaveBeenCalled();
      expect(component.categoria).toEqual(mockCategoria);
      expect(component.categoria_cursos).toEqual([]);
    });

    it('should handle both services error', () => {
      mockCategoriaService.getCategoriaId.and.returnValue(throwError(() => new Error('API Error')));
      mockCategoriaService.getCategoriaIdCursos.and.returnValue(throwError(() => new Error('API Error')));
      
      // Spy on console.error to prevent test failure
      spyOn(console, 'error');
      
      fixture = TestBed.createComponent(CategoriaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(console.error).toHaveBeenCalled();
      expect(component.categoria).toEqual({});
      expect(component.categoria_cursos).toEqual([]);
    });
  });
});
