import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../../core/services/task';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Task, TaskStatus } from '../../../../core/models/task-model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-task-viewer',
  standalone: false,
  templateUrl: './task-viewer.html',
  styleUrl: './task-viewer.css',
})
export class TaskViewerComponent implements OnInit {
  private allTasks$ = new BehaviorSubject<Task[]>([]);
  pagedTasks$!: Observable<Task[]>;

  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  pageSizes = [10, 25, 50];
  titleFilter = new FormControl('');
  teamFilter = new FormControl('');
  statusFilter = new FormControl('');

  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.refresh$
      .pipe(switchMap(() => this.taskService.getAllTasksForAdmin()))
      .subscribe((tasks) => {
        this.allTasks$.next(tasks);
      });

    this.pagedTasks$ = combineLatest([
      this.allTasks$,
      this.titleFilter.valueChanges.pipe(startWith('')),
      this.teamFilter.valueChanges.pipe(startWith('')),
      this.statusFilter.valueChanges.pipe(startWith('')),
      this.refresh$,
    ]).pipe(
      map(([tasks, title, team, status]) => {
        const filteredTasks = tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(title?.toLowerCase() ?? '') &&
            task.team.name.toLowerCase().includes(team?.toLowerCase() ?? '') &&
            (status ? task.assignments.some((a) => a.status === status) : true)
        );
        this.totalElements = filteredTasks.length;

        const startIndex = this.currentPage * this.pageSize;
        return filteredTasks.slice(startIndex, startIndex + this.pageSize);
      })
    );
  }

  loadTasks(): void {
    this.refresh$.next();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTasks();
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 0;
    this.loadTasks();
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case 'TO_DO':
        return 'text-blue-900 bg-blue-200';
      case 'IN_PROGRESS':
        return 'text-yellow-900 bg-yellow-200';
      case 'DONE':
        return 'text-green-900 bg-green-200';
      case 'BLOCKED':
        return 'text-red-900 bg-red-200';
      default:
        return 'text-gray-700 bg-gray-200';
    }
  }

  getStatusText(status: TaskStatus): string {
    return status.replace('_', ' ');
  }
}
