import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

import { AdminRoutingModule } from './admin-routing-module';
import { DashboardComponent } from './components/dashboard/dashboard';
import { TeamManagementComponent } from './components/team-management/team-management';
import { UserManagementComponent } from './components/user-management/user-management';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout';
import { TaskViewerComponent } from './components/task-viewer/task-viewer';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal';
import { LogViewerComponent } from './components/log-viewer/log-viewer';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertModalComponent } from '../../shared/components/alert-modal/alert-modal';

@NgModule({
  declarations: [
    DashboardComponent,
    TeamManagementComponent,
    UserManagementComponent,
    AdminLayoutComponent,
    TaskViewerComponent,
    LogViewerComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    NgChartsModule,
    ConfirmationModalComponent,
    NgSelectModule,
    AlertModalComponent
  ]
})
export class AdminModule { }