import { Routes } from '@angular/router';
import { isNotAuthenticatedGuard } from './shared/guards/is-not-authenticated.guard';
import { isAuthenticatedGuard } from './shared/guards/is-authenticated.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'deals',
    loadComponent: () =>
      import('./pages/deals/deals.component').then((m) => m.DealsComponent),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];
