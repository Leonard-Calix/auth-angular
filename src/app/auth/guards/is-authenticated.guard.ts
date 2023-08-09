import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  if (authService.authStatus() === AuthStatus.authenticate) {
    return true
  }

  if (authService.authStatus() === AuthStatus.checking) {
    return false
  }

  const router = inject(Router);

  const url = state.url;
  localStorage.setItem('url', url);

  router.navigateByUrl('/auth/login')
  return false;
};
