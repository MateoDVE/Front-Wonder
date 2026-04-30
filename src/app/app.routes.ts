import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./Pages/catalog/catalog').then(m => m.CatalogPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
