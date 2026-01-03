import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { CategoriasComponent } from './categorias.component';
import { CategoriaService } from 'src/app/services/categoria.service';

describe('CategoriasComponent', () => {
  let component: CategoriasComponent;
  let fixture: ComponentFixture<CategoriasComponent>;
  let mockCategoriaService: jasmine.SpyObj<CategoriaService>;

  beforeEach(() => {
    mockCategoriaService = jasmine.createSpyObj('CategoriaService', ['getAllCategorias']);
    mockCategoriaService.getAllCategorias.and.returnValue(of([]));

        TestBed.configureTestingModule({
      imports: [CategoriasComponent],
      providers: [
        provideHttpClient(),
        { provide: CategoriaService, useValue: mockCategoriaService }
      ]
    });
    fixture = TestBed.createComponent(CategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
