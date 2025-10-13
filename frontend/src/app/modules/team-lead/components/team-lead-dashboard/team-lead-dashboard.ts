import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { Task, TaskService } from '../../../../core/services/task';
import { Team, TeamService } from '../../../../core/services/team';
import { AuthService, User } from '../../../../core/services/auth';

@Component({
  selector: 'app-team-lead-dashboard',
  standalone: false,
  templateUrl: './team-lead-dashboard.html',
  styleUrls: ['./team-lead-dashboard.css'],
})
export class TeamLeadDashboardComponent implements OnInit {
  teamTasks$: Observable<Task[]> = of([]);
  myTeam$: Observable<Team | undefined> = of(undefined);
  currentUser: User | null;

  isTaskFormOpen = false;
  isMembersManagerOpen = false;

  constructor(
    private taskService: TaskService,
    private teamService: TeamService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadTeamAndTasks();
  }

  loadTeamAndTasks(): void {
    this.myTeam$ = this.teamService.getMyTeam().pipe(
      tap((myTeam) => {
        if (myTeam) {
          this.teamTasks$ = this.taskService.getTasksForTeam(myTeam.id);
        }
      }),
      catchError((error) => {
        console.error('Error fetching team for lead:', error);
        return of(undefined);
      })
    );
  }

  openTaskForm(): void {
    this.isTaskFormOpen = true;
  }

  openMembersManager(): void {
    this.isMembersManagerOpen = true;
  }

  closeModals(): void {
    this.isTaskFormOpen = false;
    this.isMembersManagerOpen = false;
  }

  handleSuccess(): void {
    this.loadTeamAndTasks();
    this.closeModals();
  }
}
