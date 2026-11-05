import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/pages/dashboard/dashboard/dashboard.routes').then(
        module => module.DASHBOARD_ROUTES
      )
  },
  {
    path: 'members',
    loadChildren: () =>
      import('./features/pages/members/members.routes').then(
        module => module.MEMBERS_ROUTES
      )
  },
  {
    path: 'classes',
    loadChildren: () =>
      import('./features/pages/classes/classes.routes').then(
        module => module.CLASSES_ROUTES
      )
  },
  {
    path: 'trainers',
    loadChildren: () =>
      import('./features/pages/trainers/trainers.routes').then(
        module => module.TRAINERS_ROUTES
      )
  },
  {
    path: 'plans',
    loadChildren: () =>
      import('./features/pages/plans/plans.routes').then(
        module => module.PLANS_ROUTES
      )
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/pages/not-found/not-found').then(
        module => module.NotFoundComponent
      )
  }
];
