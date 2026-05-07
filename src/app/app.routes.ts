import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'breweries',
    pathMatch: 'full',
  },
  {
    path: 'breweries',
    loadComponent: () =>
      import('./pages/brewery-list/brewery-list.component').then(
        (m) => m.BreweryListComponent
      ),
  },
  {
    path: 'breweries/:id',
    loadComponent: () =>
      import('./pages/brewery-detail/brewery-detail.component').then(
        (m) => m.BreweryDetailComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'breweries',
  },
];
