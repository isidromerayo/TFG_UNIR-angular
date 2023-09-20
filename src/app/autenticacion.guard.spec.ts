import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AutenticacionGuard } from './autenticacion.guard';
import { UsuarioAuth } from './model/usuario-auth';

describe('autenticacionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => AutenticacionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsuarioAuth],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
