import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { Task, TaskService, TaskStatus } from '../../../../core/services/task';

@Component({
  selector: 'app-task-board',
  standalone: false,
  templateUrl: './task-board.html',
  styleUrls: ['./task-board.css'],
})
export class TaskBoardComponent implements OnInit, OnChanges {
  @Input() tasks: Task[] | null = [];
  @Output() taskUpdated = new EventEmitter<void>();

  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  selectedTask: Task | null = null;
  constructor(private taskService: TaskService) {}
  ngOnInit(): void {
    this.organizeTasks();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      this.organizeTasks();
    }
  }
  private organizeTasks(): void {
    if (!this.tasks) return;
    this.todo = this.tasks.filter((t) => t.status === 'TO_DO');
    this.inProgress = this.tasks.filter((t) => t.status === 'IN_PROGRESS');
    this.done = this.tasks.filter((t) => t.status === 'DONE');
  }
  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as TaskStatus;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.taskService.updateTaskStatus(movedTask.id, newStatus).subscribe({
        next: () => this.taskUpdated.emit(),
        error: () => {
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
          alert('Failed to update task status.');
        },
      });
    }
  }
  openTaskModal(task: Task): void {
    this.selectedTask = task;
  }
  closeTaskModal(): void {
    this.selectedTask = null;
  }
  handleModalUpdate(): void {
    this.taskUpdated.emit();
    this.closeTaskModal();
  }
}
