import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard-module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./modules/admin/admin-module').then((m) => m.AdminModule),
      },
      {
        path: 'team-lead',
        loadChildren: () =>
          import('./modules/team-lead/team-lead-module').then(
            (m) => m.TeamLeadModule
          ),
      },
      {
        path: 'member',
        loadChildren: () =>
          import('./modules/member/member-module').then((m) => m.MemberModule),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
