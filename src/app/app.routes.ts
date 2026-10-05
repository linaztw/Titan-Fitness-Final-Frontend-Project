import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard/dashboard.routes').then(
            m => m.DASHBOARD_ROUTES
          )
      },

      {
        path: 'members',
        loadChildren: () =>
          import('./features/members/members.routes').then(
            m => m.MEMBERS_ROUTES
          )
      },

      {
        path: 'classes',
        children: [

          {
            path: '',
            loadComponent: () =>
              import('./features/classes/classes/classes').then(
                m => m.ClassesComponent
              )
          },

          {
            path: 'book-session',
            loadComponent: () =>
              import('./features/classes/book-session/book-session').then(
                m => m.BookSession
              )
          },

          {
            path: 'book-session-member',
            loadComponent: () =>
              import('./features/classes/book-session-member/book-session-member').then(
                m => m.BookSessionMember
              )
          }

        ]
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  }
];