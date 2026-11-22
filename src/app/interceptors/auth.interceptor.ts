import { HttpRequest, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { API_URL } from '../utils/constants';

/** Rutas de catálogo (solo lectura) que el backend sirve sin token. */
const CATALOGO_PUBLICO = new RegExp(`^${API_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/(categorias|cursos|valoraciones)([/?]|$)`);

/**
 * Rutas a las que NO se añade la cabecera Authorization: login y alta de usuario
 * (POST públicos) y el catálogo de solo lectura. Enviar el token ahí es inocuo
 * pero provoca preflights CORS innecesarios.
 */
export function esRutaPublica(req: Pick<HttpRequest<unknown>, 'url' | 'method'>): boolean {
  if (req.method === 'POST' && (req.url === `${API_URL}/auth` || req.url === `${API_URL}/usuarios`)) {
    return true;
  }
  return req.method === 'GET' && CATALOGO_PUBLICO.test(req.url);
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
