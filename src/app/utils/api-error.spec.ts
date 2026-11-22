import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { authErrorMessage, formatError, retryAfterSeconds } from './api-error';

describe('api-error', () => {
  describe('formatError', () => {
    it('should join field validation errors', () => {
      const err = { errors: { password: 'El password debe tener entre 8 y 72 caracteres', email: 'El email es obligatorio' } };
      expect(formatError(err)).toBe(
        'El password debe tener entre 8 y 72 caracteres. El email es obligatorio'
      );
    });

    it('should prefer field errors over the generic message', () => {
      const err = { message: 'Validation failure', errors: { nombre: 'obligatorio' } };
      expect(formatError(err)).toBe('obligatorio');
    });

    it('should fall back to message when errors is empty', () => {
      const err = { message: 'Usuario duplicado', errors: {} };
      expect(formatError(err)).toBe('Usuario duplicado');
    });

    it('should use message when there are no errors', () => {
      expect(formatError({ message: 'Sin permisos' })).toBe('Sin permisos');
    });

    it('should return a plain string error as-is', () => {
      expect(formatError('Bad Request')).toBe('Bad Request');
    });

    it('should return unknown for empty, string-less or missing errors', () => {
      expect(formatError('')).toBe('Error desconocido');
      expect(formatError({})).toBe('Error desconocido');
      expect(formatError(undefined)).toBe('Error desconocido');
    });
  });

  describe('retryAfterSeconds', () => {
    it('should read the Retry-After header in seconds', () => {
      const err = new HttpErrorResponse({ status: 429, headers: new HttpHeaders({ 'Retry-After': '30' }) });
      expect(retryAfterSeconds(err)).toBe(30);
    });

    it('should return 0 when the header is missing', () => {
      expect(retryAfterSeconds(new HttpErrorResponse({ status: 429 }))).toBe(0);
    });

    it('should return 0 for non-numeric or non-positive values', () => {
      expect(retryAfterSeconds(new HttpErrorResponse({ status: 429, headers: new HttpHeaders({ 'Retry-After': 'mañana' }) }))).toBe(0);
      expect(retryAfterSeconds(new HttpErrorResponse({ status: 429, headers: new HttpHeaders({ 'Retry-After': '0' }) }))).toBe(0);
      expect(retryAfterSeconds(new HttpErrorResponse({ status: 429, headers: new HttpHeaders({ 'Retry-After': '-5' }) }))).toBe(0);
    });
  });

  describe('authErrorMessage', () => {
    it('should explain 401 as invalid credentials', () => {
      expect(authErrorMessage(new HttpErrorResponse({ status: 401 })))
        .toBe('No se ha podido logear, revise usuario/contraseña');
    });

    it('should explain 403 as missing permissions', () => {
      expect(authErrorMessage(new HttpErrorResponse({ status: 403 })))
        .toBe('No tiene permiso para realizar esta operación');
    });

    it('should surface the Retry-After wait on 429', () => {
      const err = new HttpErrorResponse({ status: 429, headers: new HttpHeaders({ 'Retry-After': '30' }) });
      expect(authErrorMessage(err)).toBe('Demasiados intentos seguidos, vuelva a intentarlo en 30 segundos');
    });

    it('should show a generic throttling message on 429 without Retry-After', () => {
      expect(authErrorMessage(new HttpErrorResponse({ status: 429 })))
        .toBe('Demasiados intentos seguidos, espere unos minutos y vuelva a intentarlo');
    });

    it('should include the API message on other statuses', () => {
      const err = new HttpErrorResponse({ status: 500, error: { message: 'Fallo interno' } });
      expect(authErrorMessage(err)).toBe('No se ha podido acceder: Fallo interno');
    });

    it('should fall back to the credentials message for non-HTTP errors', () => {
      expect(authErrorMessage(new Error('offline')))
        .toBe('No se ha podido logear, revise usuario/contraseña');
    });
  });
});
