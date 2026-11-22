import { HttpErrorResponse } from '@angular/common/http';

/** Cuerpo de error devuelto por la API (GlobalExceptionHandler del backend). */
export interface ApiError {
  message?: string;
  errors?: Record<string, string>;
}

/**
 * Mensaje legible a partir del cuerpo de error de la API. Prioriza los errores
 * de validación por campo (`errors.*`) sobre el mensaje genérico.
 */
export function formatError(err?: unknown): string {
  if (typeof err === 'string' && err.trim() !== '') {
    return err;
  }
  if (err && typeof err === 'object') {
    const apiError = err as ApiError;
    const fieldErrors = apiError.errors ? Object.values(apiError.errors) : [];
    if (fieldErrors.length > 0) {
      return fieldErrors.join('. ');
    }
    if (apiError.message) {
      return apiError.message;
    }
  }
  return 'Error desconocido';
}

/**
 * Segundos que el backend pide esperar mediante la cabecera `Retry-After`
 * (límite de intentos de acceso). Devuelve 0 si no viene o no es un número.
 */
export function retryAfterSeconds(err: HttpErrorResponse): number {
  const header = err.headers?.get('Retry-After');
  if (!header) {
    return 0;
  }
  const seconds = Number(header);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
}

/** Mensaje específico para fallos de acceso (login) según el estado HTTP. */
export function authErrorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 401) {
      return 'No se ha podido logear, revise usuario/contraseña';
    }
    if (err.status === 403) {
      return 'No tiene permiso para realizar esta operación';
    }
    if (err.status === 429) {
      const espera = retryAfterSeconds(err);
      return espera > 0
        ? `Demasiados intentos seguidos, vuelva a intentarlo en ${espera} segundos`
        : 'Demasiados intentos seguidos, espere unos minutos y vuelva a intentarlo';
    }
    return `No se ha podido acceder: ${formatError(err.error)}`;
  }
  return 'No se ha podido logear, revise usuario/contraseña';
}
