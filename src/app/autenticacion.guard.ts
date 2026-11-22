import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AutenticacionGuard: CanActivateFn = (_route, _state) => {
  const router: Router = inject(Router);
  if (localStorage.getItem('token')!=null) {
    return true;
  } 
  void router.navigate(["/acceso"])
  return false;
};
