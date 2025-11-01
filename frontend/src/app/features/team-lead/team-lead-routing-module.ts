import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { TaskManagementComponent } from './components/task-management/task-management';
import { TeamMembersComponent } from './components/team-members/team-members';
import { MyTasksComponent } from '../member/components/my-tasks/my-tasks';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'my-tasks', component: MyTasksComponent },
  { path: 'tasks', component: TaskManagementComponent },
  { path: 'members', component: TeamMembersComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamLeadRoutingModule { }