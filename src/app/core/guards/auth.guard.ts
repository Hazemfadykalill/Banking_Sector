import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protects authenticated routes (/dashboard, /accounts, /transactions).
 * Redirects unauthenticated visits to /login preserving returnUrl.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

/**
 * Prevents authenticated users from accessing public routes (/login).
 * Redirects logged-in users back to /dashboard or requested returnUrl.
 */
export const publicGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const returnUrl = route.queryParams['returnUrl'] || '/dashboard';
    return router.createUrlTree([returnUrl]);
  }

  return true;
};
