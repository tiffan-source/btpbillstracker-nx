import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'new-bill',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'new-bill',
        loadComponent: () =>
          import('./create-bills/create-bills').then(
            (m) => m.CreateBills
          )
      }
    ]
  }
];
