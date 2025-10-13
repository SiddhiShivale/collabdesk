import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamLeadRoutingModule } from './team-lead-routing-module';
import { TaskFormComponent } from './components/task-form/task-form';
import { TeamLeadDashboardComponent } from './components/team-lead-dashboard/team-lead-dashboard';
import { DashboardModule } from '../dashboard/dashboard-module';
import { AdminModule } from '../admin/admin-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TaskFormComponent, TeamLeadDashboardComponent],
  imports: [
    CommonModule,
    TeamLeadRoutingModule,
    DashboardModule,
    AdminModule,
    ReactiveFormsModule,
  ],
})
export class TeamLeadModule {}
