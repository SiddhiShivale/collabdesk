import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { TeamFormComponent } from './components/team-form/team-form';
import { TeamListComponent } from './components/team-list/team-list';
import { TeamMembersComponent } from './components/team-members/team-members';
import { UserFormComponent } from './components/user-form/user-form';
import { UserListComponent } from './components/user-list/user-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskListComponent } from './components/task-list/task-list';
import { TaskFormComponent } from './components/task-form/task-form';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    TeamFormComponent,
    TeamListComponent,
    TeamMembersComponent,
    UserFormComponent,
    UserListComponent,
    TaskListComponent,
    TaskFormComponent,
    AnalyticsDashboardComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule, FormsModule],
  exports: [TeamMembersComponent],
})
export class AdminModule {}
