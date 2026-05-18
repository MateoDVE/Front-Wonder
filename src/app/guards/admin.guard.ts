import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  // During SSR/prerender we allow rendering; browser navigation is still protected.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getUser();
  
  console.log('[AdminGuard] User:', user);
  console.log('[AdminGuard] User rol:', user?.rol);
  
  const isAdmin = (user?.rol ?? '').toLowerCase() === 'admin';
  
  console.log('[AdminGuard] Is admin:', isAdmin);

  if (isAdmin) {
    return true;
  }

  console.log('[AdminGuard] Redirecting to home - not admin');
  return router.createUrlTree(['/']);
};
