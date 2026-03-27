import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'new-bill',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () =>
      import('./protected-shell/protected-shell.component').then(
        (m) => m.ProtectedShellComponent
      ),
    children: [
      {
        path: 'create-bill',
        loadComponent: () =>
          import('./create-bills/create-bills').then(
            (m) => m.CreateBills
          )
      },
    ]
  }
];
