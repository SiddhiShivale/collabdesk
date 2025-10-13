import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { TaskBoardComponent } from './components/task-board/task-board';
import { TaskDetailModalComponent } from './components/task-detail-modal/task-detail-modal';
import { DashboardComponent } from './dashboard';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    TaskBoardComponent,
    TaskDetailModalComponent,
    DashboardComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, DragDropModule],
  exports: [TaskBoardComponent],
})
export class DashboardModule {}
