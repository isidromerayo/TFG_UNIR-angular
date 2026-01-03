import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ValoracionComponent } from './valoracion.component';
import { ValoracionService } from 'src/app/services/valoracion.service';

describe('ValoracionComponent', () => {
  let component: ValoracionComponent;
  let fixture: ComponentFixture<ValoracionComponent>;
  let mockValoracionService: jasmine.SpyObj<ValoracionService>;

  beforeEach(() => {
    mockValoracionService = jasmine.createSpyObj('ValoracionService', [
      'getValoracionPorId',
      'getValoracionPorIdCurso',
      'getValoracionPorIdUsuario'
    ]);
    mockValoracionService.getValoracionPorId.and.returnValue(of({}));
    mockValoracionService.getValoracionPorIdCurso.and.returnValue(of({}));
    mockValoracionService.getValoracionPorIdUsuario.and.returnValue(of({}));

        TestBed.configureTestingModule({
      imports: [ValoracionComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: ValoracionService, useValue: mockValoracionService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ValoracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
