import { Routes } from '@angular/router';

export const CLASSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./classes/classes').then(module => module.ClassesComponent)
  },
  {
    path: 'book-session',
    loadComponent: () =>
      import('./book-session/book-session').then(module => module.BookSession)
  },
  {
    path: 'book-session-member',
    loadComponent: () =>
      import('./book-session-member/book-session-member').then(
        module => module.BookSessionMember
      )
  }
];
