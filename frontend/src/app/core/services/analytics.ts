import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalyticsDto {
  totalTasks: number;
  totalUsers: number;
  totalTeams: number;
  overdueTasks: number;
  completionRate: number;
  tasksByStatus: { [key: string]: number };
  tasksByTeam: { [key: string]: number };
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private baseUrl = 'http://localhost:8080/api/analytics';

  constructor(private http: HttpClient) {}

  getAnalyticsDashboard(): Observable<AnalyticsDto> {
    return this.http.get<AnalyticsDto>(`${this.baseUrl}/dashboard`);
  }
}
