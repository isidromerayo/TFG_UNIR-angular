import { HttpRequest, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { API_URL } from '../utils/constants';

/** Raíces de ruta del catálogo (solo lectura) que el backend sirve sin token. */
const CATALOGO_PUBLICO = new Set(['categorias', 'cursos', 'valoraciones']);

/** Primera sección del path relativo a API_URL; null si la URL no es de la API. */
function raizRelativa(url: string): string | null {
  if (url === API_URL) {
    return '';
  }
  if (!url.startsWith(`${API_URL}/`)) {
    return null;
  }
  return url.slice(API_URL.length + 1).split(/[/?#]/)[0];
}

/**
 * Rutas a las que NO se añade la cabecera Authorization: login y alta de usuario
 * (POST públicos) y el catálogo de solo lectura. Enviar el token ahí es inocuo
 * pero provoca preflights CORS innecesarios.
 */
export function esRutaPublica(req: Pick<HttpRequest<unknown>, 'url' | 'method'>): boolean {
  if (req.method === 'POST' && (req.url === `${API_URL}/auth` || req.url === `${API_URL}/usuarios`)) {
    return true;
  }
  return req.method === 'GET' && CATALOGO_PUBLICO.has(raizRelativa(req.url) ?? '');
}

/** Añade `Authorization: Bearer <token>` a las rutas protegidas cuando hay sesión. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (!token || token === 'undefined' || esRutaPublica(req)) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
