import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { CategoriaComponent } from './categoria.component';
import { CategoriaService } from 'src/app/services/categoria.service';

describe('CategoriaComponent', () => {
  let component: CategoriaComponent;
  let fixture: ComponentFixture<CategoriaComponent>;
  let mockCategoriaService: jasmine.SpyObj<CategoriaService>;

  beforeEach(() => {
    mockCategoriaService = jasmine.createSpyObj('CategoriaService', ['getCategoriaId', 'getCategoriaIdCursos']);
    mockCategoriaService.getCategoriaId.and.returnValue(of({}));
    mockCategoriaService.getCategoriaIdCursos.and.returnValue(of([]));

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
});
