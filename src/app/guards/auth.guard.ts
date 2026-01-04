import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('authGuard ejecutado');
  console.log('Token existe:', authService.getToken());
  console.log('isLoggedIn:', authService.isLoggedIn());

  if (authService.isLoggedIn()) {
    console.log('Acceso permitido');
    return true;
  }

  console.log('Acceso denegado, redirigiendo a /login');
  router.navigate(['/login']);
  return false;
};