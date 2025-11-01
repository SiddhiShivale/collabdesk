import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { NgSelectModule } from '@ng-select/ng-select';
import { TeamLeadRoutingModule } from './team-lead-routing-module';
import { DashboardComponent } from './components/dashboard/dashboard';
import { TaskManagementComponent } from './components/task-management/task-management';
import { TeamMembersComponent } from './components/team-members/team-members';
import { TeamLeadLayoutComponent } from './components/team-lead-layout/team-lead-layout';
import { FilterByStatusPipe } from "../../shared/pipes/filter-by-status-pipe";
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal';

@NgModule({
  declarations: [
    DashboardComponent,
    TaskManagementComponent,
    TeamMembersComponent,
    TeamLeadLayoutComponent
  ],
  imports: [
    CommonModule,
    TeamLeadRoutingModule,
    FilterByStatusPipe,
    ReactiveFormsModule,
    NgChartsModule,
    ConfirmationModalComponent,
    NgSelectModule  
  ]
})
export class TeamLeadModule { }