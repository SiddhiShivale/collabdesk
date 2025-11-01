import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { UserManagementComponent } from './components/user-management/user-management';
import { TeamManagementComponent } from './components/team-management/team-management';
import { TaskViewerComponent } from './components/task-viewer/task-viewer';
import { LogViewerComponent } from './components/log-viewer/log-viewer';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UserManagementComponent },
  { path: 'teams', component: TeamManagementComponent },
  { path: 'tasks', component: TaskViewerComponent },
  { path: 'logs', component: LogViewerComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }