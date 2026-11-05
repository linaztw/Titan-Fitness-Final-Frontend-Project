import { Routes } from '@angular/router';

export const MEMBERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./members/members').then(
        m => m.MembersComponent
      )
  },

  {
    path: ':id/freeze',
    loadComponent: () =>
      import('./freeze-membership/freeze-membership/freeze-membership').then(
        m => m.FreezeMembership
      )
  },

  {
    path: ':id',
    loadComponent: () =>
      import('./member-profile/member-profile/member-profile').then(
        m => m.MemberProfileComponent
      )
  }
];