import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';
import { inject } from '@angular/core';

export const isNotAuthenticateGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authStatus() === AuthStatus.authenticate) {
    router.navigateByUrl('/dashboard')
    return false;
  }
  return true;
};
