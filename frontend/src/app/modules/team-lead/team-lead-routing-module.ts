import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamLeadDashboardComponent } from './components/team-lead-dashboard/team-lead-dashboard';

const routes: Routes = [
  {
    path: '',
    component: TeamLeadDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamLeadRoutingModule {}
