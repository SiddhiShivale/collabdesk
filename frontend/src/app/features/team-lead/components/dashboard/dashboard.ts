import { Component, OnInit } from '@angular/core';
import { Team } from '../../../../core/models/team-model';
import { Task } from '../../../../core/models/task-model';
import { TeamService } from '../../../../core/services/team';
import { TaskService } from '../../../../core/services/task';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  team: Team | null = null;
  tasks: Task[] = [];

  teamNotFoundError = false;
  isLoading = true;
  overdueTasksCount = 0;

  public workloadChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public workloadChartOptions: ChartConfiguration<'bar'>['options'] = {
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
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 13, weight: '500' },
        },
      },
    },
  };

  constructor(
    private teamService: TeamService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.teamService.getMyTeam().subscribe({
      next: (team) => {
        this.team = team;
        this.loadTasksForTeam(team.id);
      },
      error: (error) => {
        if (error.status === 404) {
          this.teamNotFoundError = true;
        }
        this.isLoading = false;
      },
    });
  }

  loadTasksForTeam(teamId: number): void {
    this.taskService.getTasksForTeam(teamId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.calculateOverdueTasks(tasks);
        if (this.team) {
          this.setupWorkloadChart(tasks, this.team);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  getTaskCountByStatus(tasks: Task[], status: string): number {
    if (!tasks) return 0;
    return tasks
      .flatMap((task) => task.assignments)
      .filter((a) => a.status === status).length;
  }

  private calculateOverdueTasks(tasks: Task[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.overdueTasksCount = tasks.filter(
      (task) =>
        new Date(task.dueDate) < today &&
        task.assignments.some((a) => a.status !== 'DONE')
    ).length;
  }

  private setupWorkloadChart(tasks: Task[], team: Team): void {
    const workloadMap = new Map<string, number>();
    team.members.forEach((member) => workloadMap.set(member.name, 0));

    tasks.forEach((task) => {
      task.assignments.forEach((assignment) => {
        if (
          assignment.status === 'TO_DO' ||
          assignment.status === 'IN_PROGRESS'
        ) {
          const memberName = team.members.find(
            (m) => m.id === assignment.userId
          )?.name;
          if (memberName && workloadMap.has(memberName)) {
            workloadMap.set(memberName, workloadMap.get(memberName)! + 1);
          }
        }
      });
    });

    const memberNames = Array.from(workloadMap.keys());
    const taskCounts = Array.from(workloadMap.values());

    this.workloadChartData = {
      labels: memberNames,
      datasets: [
        {
          data: taskCounts,
          label: 'Pending Tasks',
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
  }
}
