// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Pregunta al servicio si el usuario está logueado
  if (authService.isLoggedIn()) {
    return true; // Sí está logueado, déjalo pasar
  }

  // 2. Si no está logueado, redirígelo a la página de login
  router.navigate(['/login']);
  return false; // No lo dejes pasar
};