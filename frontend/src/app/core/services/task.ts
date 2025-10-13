import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth';
import { Team } from './team';

export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  assignees: User[];
  creator: User;
  team: Team;
}

export interface TaskCreateDto {
  title: string;
  description?: string;
  dueDate?: string;
  teamId: number;
  assigneeIds: number[];
}

export interface AnalyticsDto {
  totalTasks: number;
  totalUsers: number;
  totalTeams: number;

  overdueTasks: number;
  completionRate: number;

  tasksByStatus: { [status: string]: number };
  tasksByTeam: { [teamName: string]: number };
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getTasksForTeam(teamId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/teams/${teamId}/tasks`);
  }

  getPrioritizedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/prioritized`);
  }

  createTask(task: TaskCreateDto): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  updateTaskStatus(taskId: number, status: TaskStatus): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${taskId}/status`, {
      status,
    });
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);
  }

  getSystemAnalytics(): Observable<AnalyticsDto> {
    return this.http.get<AnalyticsDto>(`${this.apiUrl}/analytics/dashboard`);
  }
}
