import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

function checkGuest(): true | UrlTree {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? router.createUrlTree(['/manga']) : true;
}

export const GuestGuard: CanActivateFn & CanMatchFn = () => checkGuest();
