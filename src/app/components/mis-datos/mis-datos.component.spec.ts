import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { MisDatosComponent } from './mis-datos.component';
import { AuthService } from 'src/app/services/auth.service';

describe('MisDatosComponent', () => {
  let component: MisDatosComponent;
  let fixture: ComponentFixture<MisDatosComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    mockAuthService.getUser.and.returnValue({});

        TestBed.configureTestingModule({
      imports: [MisDatosComponent],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(MisDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize usuario from AuthService', () => {
    expect(mockAuthService.getUser).toHaveBeenCalled();
    expect(component.usuario).toEqual({});
  });
});
