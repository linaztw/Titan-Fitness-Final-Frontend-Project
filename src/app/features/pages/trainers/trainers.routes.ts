import { Routes } from '@angular/router';

export const TRAINERS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./trainer-directory/trainer-directory').then(module => module.TrainerDirectoryComponent) },
  { path: 'new', loadComponent: () => import('./trainer-details/trainer-details').then(module => module.TrainerDetailsComponent) },
  { path: ':id/edit', loadComponent: () => import('./trainer-details/trainer-details').then(module => module.TrainerDetailsComponent) },
  { path: ':id', loadComponent: () => import('./trainer-details/trainer-details').then(module => module.TrainerDetailsComponent) }
];
