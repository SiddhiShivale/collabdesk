import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { UserListComponent } from './components/user-list/user-list';
import { TeamListComponent } from './components/team-list/team-list';
import { TeamMembersComponent } from './components/team-members/team-members';
import { UserFormComponent } from './components/user-form/user-form';
import { TeamFormComponent } from './components/team-form/team-form';
import { TaskListComponent } from './components/task-list/task-list';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: 'users', component: UserListComponent },
      { path: 'teams', component: TeamListComponent },
      { path: 'tasks', component: TaskListComponent },
      { path: 'analytics', component: AnalyticsDashboardComponent },
      { path: 'teams/:id/members', component: TeamMembersComponent },
      { path: 'add-user', component: UserFormComponent },
      { path: 'add-team', component: TeamFormComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
