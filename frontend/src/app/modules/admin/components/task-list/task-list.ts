import { Component, OnInit } from '@angular/core';
import { Task, TaskService } from '../../../../core/services/task';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { User } from '../../../../core/services/auth';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
})
export class TaskListComponent implements OnInit {
  private refreshTasks$ = new BehaviorSubject<boolean>(true);
  tasks$!: Observable<Task[]>;
  isTaskFormModalOpen: boolean = false;
  selectedTask: Task | null = null;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.refreshTasks$.pipe(
      switchMap(() => this.taskService.getAllTasks())
    );
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  loadTasks(): void {
    this.refreshTasks$.next(true);
  }

  getAssigneeNames(assignees: User[] | undefined): string {
    if (!assignees || assignees.length === 0) {
      return '';
    }
    return assignees.map((a) => a.name).join(', ');
  }

  deleteTask(id: number): void {
    if (
      confirm(
        'Are you sure you want to delete this task? This action cannot be undone.'
      )
    ) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          console.log(`Task ${id} deleted successfully.`);
          this.handleSuccess();
        },
        error: (err) => {
          console.error('Error deleting task:', err);
        },
      });
    }
  }

  handleSuccess(): void {
    this.refreshTasks$.next(true);
    this.closeModals();
  }

  closeModals(): void {
    this.isTaskFormModalOpen = false;
    this.selectedTask = null;
  }

  openCreateTaskModal(): void {
    this.selectedTask = null;
    this.isTaskFormModalOpen = true;
  }

  openEditTaskModal(task: Task): void {
    this.selectedTask = task;
    this.isTaskFormModalOpen = true;
  }
}
