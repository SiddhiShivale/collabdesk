import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Task, TaskStatus } from '../../../../core/models/task-model';
import { TaskService } from '../../../../core/services/task';
import { TaskAssignment } from '../../../../core/models/task-assignment-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-tasks.html',
  styleUrl: './my-tasks.css',
})
export class MyTasksComponent implements OnInit {
  toDoAssignments: TaskAssignment[] = [];
  inProgressAssignments: TaskAssignment[] = [];
  doneAssignments: TaskAssignment[] = [];

  selectedTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadMyTaskAssignments();
  }

  loadMyTaskAssignments(): void {
    this.taskService
      .getPrioritizedTaskAssignmentsForCurrentUser()
      .subscribe((assignments) => {
        this.toDoAssignments = assignments.filter((a) => a.status === 'TO_DO');
        this.inProgressAssignments = assignments.filter(
          (a) => a.status === 'IN_PROGRESS'
        );
        this.doneAssignments = assignments.filter((a) => a.status === 'DONE');
      });
  }

  updateTaskStatus(assignment: TaskAssignment, newStatus: TaskStatus): void {
    if (newStatus === 'IN_PROGRESS' && assignment.task.dependsOn) {
      alert(
        `Cannot start this task. Please complete the dependency task first: "${assignment.task.dependsOn.title}"`
      );
      return;
    }

    this.taskService
      .updateTaskAssignmentStatus(assignment.id, newStatus)
      .subscribe(() => {
        this.loadMyTaskAssignments();
      });
  }

  viewTaskDetails(task: Task): void {
    this.selectedTask = task;
  }

  closeTaskDetails(): void {
    this.selectedTask = null;
  }
}
