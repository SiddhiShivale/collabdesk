import { Component, OnInit } from '@angular/core';
import { AnalyticsDto, TaskService } from '../../../../core/services/task';
import { catchError, map, Observable, of } from 'rxjs';

interface StatusItem {
  status: string;
  count: number;
  class: string;
  percentage: number;
  angleEnd: number;
}

interface TeamTaskItem {
  teamName: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: false,
  templateUrl: './analytics-dashboard.html',
  styleUrls: ['./analytics-dashboard.css'],
})
export class AnalyticsDashboardComponent implements OnInit {
  constructor(private taskService: TaskService) {}

  analytics$!: Observable<AnalyticsDto>;
  tasksByStatus$!: Observable<StatusItem[]>;
  tasksByTeamChartData$!: Observable<TeamTaskItem[]>;

  ngOnInit(): void {
    this.analytics$ = this.taskService.getSystemAnalytics().pipe(
      catchError((error) => {
        console.error('Failed to load analytics data:', error);
        return of({
          totalTasks: 0,
          totalUsers: 0,
          totalTeams: 0,
          overdueTasks: 0,
          completionRate: 0,
          tasksByStatus: {},
          tasksByTeam: {},
        } as AnalyticsDto);
      })
    );

    this.tasksByStatus$ = this.analytics$.pipe(
      map((data) => this.mapStatusData(data.tasksByStatus, data.totalTasks))
    );

    this.tasksByTeamChartData$ = this.analytics$.pipe(
      map((data) => this.mapTeamData(data.tasksByTeam))
    );
  }

  getPieChartStyle(statusData: StatusItem[]): string {
    if (!statusData || statusData.length === 0) {
      return 'none';
    }

    const gradientSegments = statusData.map((item, index) => {
      const startAngle = index === 0 ? 0 : statusData[index - 1].angleEnd;

      return `var(--${item.class}-color) ${startAngle}deg ${item.angleEnd}deg`;
    });

    return `conic-gradient(${gradientSegments.join(', ')})`;
  }

  private mapStatusData(
    tasksByStatus: { [status: string]: number },
    totalTasks: number
  ): StatusItem[] {
    const statusOrder = ['TO_DO', 'IN_PROGRESS', 'BLOCKED', 'DONE'];
    const totalTasksForPercentage = totalTasks > 0 ? totalTasks : 1;
    let currentAngle = 0;

    const mappedItems = statusOrder
      .map((status) => {
        const count = tasksByStatus[status] || 0;
        let cssClass = '';
        const percentage = Math.round((count / totalTasksForPercentage) * 100);
        const angle = (count / totalTasksForPercentage) * 360;

        switch (status) {
          case 'TO_DO':
            cssClass = 'status-todo';
            break;
          case 'IN_PROGRESS':
            cssClass = 'status-in-progress';
            break;
          case 'DONE':
            cssClass = 'status-done';
            break;
          case 'BLOCKED':
            cssClass = 'status-blocked';
            break;
          default:
            cssClass = 'status-default';
        }

        currentAngle += angle;
        const angleEnd = Math.min(currentAngle, 360);

        return { status, count, class: cssClass, percentage, angleEnd };
      })
      .filter((item) => item.count > 0);

    if (mappedItems.length > 0) {
      mappedItems[mappedItems.length - 1].angleEnd = 360;
    }

    return mappedItems;
  }

  private mapTeamData(tasksByTeam: {
    [teamName: string]: number;
  }): TeamTaskItem[] {
    if (Object.keys(tasksByTeam).length === 0) return [];

    const maxTasks = Math.max(...Object.values(tasksByTeam));

    return Object.entries(tasksByTeam)
      .map(([teamName, count]) => {
        const percentage =
          maxTasks > 0 ? Math.round((count / maxTasks) * 100) : 0;
        return { teamName, count, percentage };
      })
      .sort((a, b) => b.count - a.count);
  }
}
