import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AutenticacionGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  if (localStorage.getItem('token')!=null) {
    return true;
  } 
  router.navigate(["/acceso"])
  return false;
};
