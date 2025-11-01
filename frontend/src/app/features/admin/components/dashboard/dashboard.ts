import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  AnalyticsDto,
  AnalyticsService,
} from '../../../../core/services/analytics';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  analytics$: Observable<AnalyticsDto> | undefined;

  public pieChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  public pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.analytics$ = this.analyticsService
      .getAnalyticsDashboard()
      .pipe(tap((analytics) => this.setupCharts(analytics)));
  }

  private setupCharts(analytics: AnalyticsDto): void {
    const statusLabels = Object.keys(analytics.tasksByStatus);
    const statusData = Object.values(analytics.tasksByStatus);
    this.pieChartData = {
      labels: statusLabels,
      datasets: [
        {
          data: statusData,
          backgroundColor: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'],
          hoverBackgroundColor: ['#2563EB', '#D97706', '#059669', '#DC2626'],
        },
      ],
    };

    const teamLabels = Object.keys(analytics.tasksByTeam);
    const teamData = Object.values(analytics.tasksByTeam);
    this.barChartData = {
      labels: teamLabels,
      datasets: [
        {
          data: teamData,
          label: 'Pending Tasks',
          backgroundColor: 'rgba(79, 70, 229, 0.8)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 1,
        },
      ],
    };
  }
}
