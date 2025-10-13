import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing-module';
import { MemberDashboardComponent } from './components/member-dashboard/member-dashboard';
import { DashboardModule } from '../dashboard/dashboard-module';

@NgModule({
  declarations: [MemberDashboardComponent],
  imports: [CommonModule, MemberRoutingModule, DashboardModule],
})
export class MemberModule {}
