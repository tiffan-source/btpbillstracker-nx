import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'create-bill',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/protected-shell/protected-shell.component').then(
        (m) => m.ProtectedShellComponent
      ),
    children: [
      {
        path: 'create-bill',
        loadComponent: () =>
          import('./pages/create-bills/create-bills').then(
            (m) => m.CreateBills
          )
      },
    ],
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register').then((m) => m.Register)
  }
];
