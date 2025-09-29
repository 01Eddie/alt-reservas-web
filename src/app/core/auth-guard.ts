import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './services/auth';

export const authGuard: CanActivateFn = () => {
  // const router = inject(Router);
  // const token = localStorage.getItem('access_token');

  // // if (typeof window === 'undefined') {
  // //   router.navigate(['/login']);

  // //   return false;
  // // }

  // if (token) {
  //   return true; // ✅ puede acceder
  // } else {
  //   router.navigate(['/login']);
  //   return false; // ❌ redirige si no hay token
  // }
  const router = inject(Router);
  const storage  = inject(Auth);

  if (!storage.hasToken()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
