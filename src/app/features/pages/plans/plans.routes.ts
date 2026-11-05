import { Routes } from '@angular/router';

export const PLANS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./plan-catalogue/plan-catalogue').then(module => module.PlanCatalogueComponent) },
  { path: 'new', loadComponent: () => import('./plan-details/plan-details').then(module => module.PlanDetailsComponent) },
  { path: ':id/edit', loadComponent: () => import('./plan-details/plan-details').then(module => module.PlanDetailsComponent) },
  { path: ':id', loadComponent: () => import('./plan-details/plan-details').then(module => module.PlanDetailsComponent) }
];
