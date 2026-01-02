import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { HomeService } from 'src/app/services/home.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockHomeService: jasmine.SpyObj<HomeService>;

  beforeEach(() => {
    mockHomeService = jasmine.createSpyObj('HomeService', [
      'getCursosDestacadosPortada',
      'getOpinionesCursosPortada',
      'getCursosUltimasPortada'
    ]);

    // Mock responses
    mockHomeService.getCursosDestacadosPortada.and.returnValue(of([]));
    mockHomeService.getOpinionesCursosPortada.and.returnValue(of([]));
    mockHomeService.getCursosUltimasPortada.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: HomeService, useValue: mockHomeService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty arrays', () => {
    expect(component.cursos).toEqual([]);
    expect(component.opiniones).toEqual([]);
    expect(component.actualizaciones).toEqual([]);
  });

  it('should call HomeService methods on initialization', () => {
    expect(mockHomeService.getCursosDestacadosPortada).toHaveBeenCalled();
    expect(mockHomeService.getOpinionesCursosPortada).toHaveBeenCalled();
    expect(mockHomeService.getCursosUltimasPortada).toHaveBeenCalled();
  });
});
