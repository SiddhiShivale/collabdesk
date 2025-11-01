import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';
import { SetupAccountComponent } from './features/auth/components/setup-account/setup-account';
import { ForgotPasswordComponent } from './features/auth/components/forgot-password/forgot-password';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'setup-account', component: SetupAccountComponent },

  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin-module').then((m) => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['ADMIN'] },
  },

  {
    path: 'team-lead',
    loadChildren: () =>
      import('./features/team-lead/team-lead-module').then(
        (m) => m.TeamLeadModule
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['TEAM_LEAD'] },
  },

  {
    path: 'member',
    loadChildren: () =>
      import('./features/member/member-module').then((m) => m.MemberModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['MEMBER'] },
  },

  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile-module').then((m) => m.ProfileModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['TEAM_LEAD', 'ADMIN', 'MEMBER'] },
  },

  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
