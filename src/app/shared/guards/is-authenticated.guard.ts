import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuth } from '../../store/auth/selector';

export const isAuthenticatedGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  if (store.selectSignal(selectIsAuth)()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
