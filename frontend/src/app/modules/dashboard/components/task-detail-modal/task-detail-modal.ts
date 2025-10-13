import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Task, TaskService, TaskStatus } from '../../../../core/services/task';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-task-detail-modal',
  standalone: false,
  templateUrl: './task-detail-modal.html',
  styleUrls: ['./task-detail-modal.css'],
})
export class TaskDetailModalComponent {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<void>();

  isTeamLeadOrAdmin$: Observable<boolean>;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {
    this.isTeamLeadOrAdmin$ = this.authService.currentUser$.pipe(
      map(
        (user) => !!user && (user.role === 'TEAM_LEAD' || user.role === 'ADMIN')
      )
    );
  }

  onStatusChange(event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value as TaskStatus;
    this.taskService.updateTaskStatus(this.task.id, newStatus).subscribe(() => {
      this.taskUpdated.emit();
    });
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task.id).subscribe(() => {
        this.taskUpdated.emit();
      });
    }
  }
}
