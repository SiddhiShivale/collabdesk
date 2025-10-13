import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, map } from 'rxjs';
import { TaskBoardComponent } from '../../../dashboard/components/task-board/task-board';
import { Task, TaskService } from '../../../../core/services/task';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-member-dashboard',
  standalone: false,
  templateUrl: './member-dashboard.html',
  styleUrls: ['./member-dashboard.css'],
})
export class MemberDashboardComponent implements OnInit {
  myTasks$: Observable<Task[]> = of([]);
  allTeamTasks$: Observable<Task[]> = of([]);

  private teamId: number | undefined;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    this.allTeamTasks$ = this.taskService.getPrioritizedTasks().pipe(
      map((allTasks) => {
        const myTasks = allTasks.filter((task) =>
          task.assignees.some((assignee) => assignee.id === currentUser.id)
        );

        if (myTasks.length > 0 && !this.teamId) {
          this.teamId = myTasks[0].team.id;
        }

        if (this.teamId) {
          return allTasks.filter((task) => task.team.id === this.teamId);
        }

        return myTasks;
      })
    );
  }
}
