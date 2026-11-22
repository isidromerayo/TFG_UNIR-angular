import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../services/auth.service';
import { API_URL } from '../utils/constants';

/**
 * Trata de forma centralizada los fallos de autorización en rutas protegidas:
 *  - 401: cierra la sesión, avisa y redirige a /acceso (sesión caducada).
 *  - 403: informa de falta de permisos sin cerrar la sesión (el `id` pedido no
 *    casa con el del token).
 * El 401/403 del login (`POST /auth`) NO se trata aquí: lo muestra el
 * componente de acceso con su propio mensaje de credenciales.
 */
export const sesionInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const esLogin = req.method === 'POST' && req.url === `${API_URL}/auth`;
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (!esLogin && err.status === 401) {
        auth.logout();
        Swal.fire('Sesión caducada', 'Su sesión ha expirado, vuelva a acceder', 'warning');
        void router.navigate(['/acceso']);
      } else if (!esLogin && err.status === 403) {
        Swal.fire('Sin permisos', 'No tiene permiso para ver estos datos', 'error');
      }
      return throwError(() => err);
    })
  );
};
