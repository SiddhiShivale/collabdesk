// src/app/features/member/components/my-tasks/my-tasks.ts
import { Component, OnInit } from '@angular/core';
import { Task, TaskStatus, Importance } from '../../../../core/models/task-model';
import { TaskService } from '../../../../core/services/task';
import { TaskAssignment } from '../../../../core/models/task-assignment-model';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { AlertModalComponent } from '../../../../shared/components/alert-modal/alert-modal'; // Import the alert modal

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, DragDropModule, AlertModalComponent], // Add AlertModalComponent to imports
  templateUrl: './my-tasks.html',
  styleUrls: ['./my-tasks.css']
})
export class MyTasksComponent implements OnInit {
  toDoAssignments: TaskAssignment[] = [];
  inProgressAssignments: TaskAssignment[] = [];
  doneAssignments: TaskAssignment[] = [];

  selectedTask: Task | null = null;

  // State for the custom alert modal
  isAlertVisible = false;
  alertTitle = '';
  alertMessage = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadMyTaskAssignments();
  }

  loadMyTaskAssignments(): void {
    this.taskService.getPrioritizedTaskAssignmentsForCurrentUser().subscribe(assignments => {
      this.toDoAssignments = assignments.filter(a => a.status === 'TO_DO' || a.status === 'BLOCKED');
      this.inProgressAssignments = assignments.filter(a => a.status === 'IN_PROGRESS');
      this.doneAssignments = assignments.filter(a => a.status === 'DONE');
    });
  }

  updateTaskStatus(assignment: TaskAssignment, newStatus: TaskStatus): void {
    // If the user tries to start a blocked task via the button
    if (newStatus === 'IN_PROGRESS' && this.isTaskBlocked(assignment)) {
      // FIX: Use the custom alert modal
      this.showAlert('Action Blocked', `Cannot start this task. Please complete the dependency task first: "${assignment.task.dependsOn?.title}"`);
      return;
    }

    this.taskService.updateTaskAssignmentStatus(assignment.id, newStatus).subscribe({
      // THIS IS THE CRITICAL FIX:
      // On success, we update the local object's status and then reload the lists.
      next: (updatedAssignment) => {
        assignment.status = updatedAssignment.status;
        // Reload and re-sort the lists to reflect the change visually
        this.loadMyTaskAssignments(); 
      },
      // On failure, we revert the UI by reloading everything from the server.
      error: () => {
        this.loadMyTaskAssignments();
        this.showAlert('Error', 'An error occurred while updating the task status.');
      }
    });
  }

  isTaskBlocked(assignment: TaskAssignment): boolean {
    if (!assignment.task.dependsOn) {
      return false;
    }
    
    const allAssignments = [...this.toDoAssignments, ...this.inProgressAssignments, ...this.doneAssignments];
    const dependencyAssignment = allAssignments.find(a => a.task.id === assignment.task.dependsOn?.id);

    return dependencyAssignment ? dependencyAssignment.status !== 'DONE' : false;
  }

  // Helper methods for the custom alert
  showAlert(title: string, message: string): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.isAlertVisible = true;
  }

  closeAlertModal(): void {
    this.isAlertVisible = false;
  }

  // Other helper methods
  getImportanceBorder(importance: Importance): string {
    switch (importance) {
      case 'HIGH': return 'border-red-500';
      case 'MEDIUM': return 'border-yellow-400';
      case 'LOW': return 'border-green-500';
      default: return 'border-gray-300';
    }
  }

  getStatusText(status: TaskStatus): string {
    return status.replace('_', ' ');
  }

  viewTaskDetails(task: Task): void {
    this.selectedTask = task;
  }

  closeTaskDetails(): void {
    this.selectedTask = null;
  }
}