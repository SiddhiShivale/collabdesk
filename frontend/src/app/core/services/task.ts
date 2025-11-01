import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus, Importance } from '../models/task-model';
import { TaskAssignment } from '../models/task-assignment-model';

export interface TaskCreateDto {
  title: string;
  description: string;
  importance: Importance;
  teamId: number;
  assigneeIds: number[];
  dueDate: string;
  dependsOnTaskId?: number;
}

export interface TaskUpdateDto {
  title?: string;
  description?: string;
  importance?: Importance;
  assigneeIds?: number[];
  dueDate?: string;
  dependsOnTaskId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getTasksForTeam(teamId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/teams/${teamId}/tasks`);
  }

  createTask(taskData: TaskCreateDto): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, taskData);
  }

  updateTask(taskId: number, taskData: TaskUpdateDto): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${taskId}`, taskData);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${taskId}`);
  }

  getPrioritizedTaskAssignmentsForCurrentUser(): Observable<TaskAssignment[]> {
    return this.http.get<TaskAssignment[]>(`${this.baseUrl}/tasks/prioritized`);
  }

  updateTaskAssignmentStatus(
    assignmentId: number,
    status: TaskStatus
  ): Observable<TaskAssignment> {
    const payload = { status };
    return this.http.patch<TaskAssignment>(
      `${this.baseUrl}/task-assignments/${assignmentId}/status`,
      payload
    );
  }

  getAllTasksForAdmin(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
  }
}
