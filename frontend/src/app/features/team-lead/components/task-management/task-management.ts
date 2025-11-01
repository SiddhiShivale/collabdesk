import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { Team } from '../../../../core/models/team-model';
import { Task, TaskStatus } from '../../../../core/models/task-model';
import { TeamService } from '../../../../core/services/team';
import { TaskService } from '../../../../core/services/task';
import { formatDate } from '@angular/common';

export function futureOrPresentDateValidator(
  control: AbstractControl
): ValidationErrors | null {
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const userDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  if (userDate < today) {
    return { pastDate: true };
  }
  return null;
}

@Component({
  selector: 'app-task-management',
  standalone: false,
  templateUrl: './task-management.html',
  styleUrl: './task-management.css',
})
export class TaskManagementComponent implements OnInit {
  team$!: Observable<Team>;
  private allTasks$ = new BehaviorSubject<Task[]>([]);
  pagedTasks$!: Observable<Task[]>;

  availableDependencies$!: Observable<Task[]>;
  isConfirmModalVisible = false;
  taskIdToDelete: number | null = null;
  taskForm!: FormGroup;
  isModalVisible = false;
  isEditMode = false;
  currentTaskId: number | null = null;
  private refresh$ = new BehaviorSubject<void>(undefined);

  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  pageSizes = [10, 25, 50];
  titleFilter = new FormControl('');
  assigneeFilter = new FormControl('');
  statusFilter = new FormControl('');

  constructor(
    private teamService: TeamService,
    private taskService: TaskService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTeamAndTasks();
  }

  initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      importance: ['MEDIUM', Validators.required],
      assigneeIds: [[], Validators.required],
      dependsOnTaskId: [null],
    });
  }

  loadTeamAndTasks(): void {
    this.team$ = this.refresh$.pipe(
      switchMap(() => this.teamService.getMyTeam())
    );

    this.team$
      .pipe(
        switchMap((team) => {
          if (team) {
            return this.taskService.getTasksForTeam(team.id);
          }
          return of([]);
        })
      )
      .subscribe((tasks) => {
        this.allTasks$.next(tasks);
      });

    this.pagedTasks$ = combineLatest([
      this.allTasks$,
      this.titleFilter.valueChanges.pipe(startWith('')),
      this.assigneeFilter.valueChanges.pipe(startWith('')),
      this.statusFilter.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([tasks, title, assignee, status]) => {
        const filteredTasks = tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(title?.toLowerCase() ?? '') &&
            task.assignments.some((a) =>
              a.userName.toLowerCase().includes(assignee?.toLowerCase() ?? '')
            ) &&
            (status ? task.assignments.some((a) => a.status === status) : true)
        );
        this.totalElements = filteredTasks.length;
        const startIndex = this.currentPage * this.pageSize;
        return filteredTasks.slice(startIndex, startIndex + this.pageSize);
      })
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 0;
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

  private setupDependencies(allTasks: Task[]): void {
    this.availableDependencies$ = of(allTasks).pipe(
      map((tasks) => {
        if (this.isEditMode && this.currentTaskId) {
          return tasks.filter((task) => task.id !== this.currentTaskId);
        }
        return tasks;
      })
    );
  }

  openAddTaskModal(): void {
    this.isEditMode = false;
    this.currentTaskId = null;
    this.isModalVisible = true;
    this.taskForm.reset({ importance: 'MEDIUM', dependsOnTaskId: null });
    this.allTasks$.subscribe((tasks) => this.setupDependencies(tasks));
  }

  openEditTaskModal(task: Task): void {
    this.isEditMode = true;
    this.isModalVisible = true;
    this.currentTaskId = task.id;

    this.taskForm.setValue({
      title: task.title,
      description: task.description || '',
      dueDate: formatDate(task.dueDate, 'yyyy-MM-dd', 'en-US'),
      importance: task.importance || 'MEDIUM',
      assigneeIds: task.assignments.map((a) => a.userId),
      dependsOnTaskId: task.dependsOn ? task.dependsOn.id : null,
    });
    this.allTasks$.subscribe((tasks) => this.setupDependencies(tasks));
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.currentTaskId = null;
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.team$.pipe(take(1)).subscribe((team) => {
      if (!team) return;

      const formValue = this.taskForm.value;
      const assigneeIds = Array.isArray(formValue.assigneeIds)
        ? formValue.assigneeIds.map(Number)
        : [Number(formValue.assigneeIds)];

      const apiCall$ =
        this.isEditMode && this.currentTaskId
          ? this.taskService.updateTask(this.currentTaskId, {
              ...formValue,
              assigneeIds,
            })
          : this.taskService.createTask({
              ...formValue,
              teamId: team.id,
              assigneeIds,
            });

      apiCall$.subscribe(() => {
        this.refresh$.next();
        this.closeModal();
      });
    });
  }

  deleteTask(taskId: number): void {
    this.taskIdToDelete = taskId;
    this.isConfirmModalVisible = true;
  }

  handleDeleteConfirmation(isConfirmed: boolean): void {
    if (isConfirmed && this.taskIdToDelete) {
      this.taskService.deleteTask(this.taskIdToDelete).subscribe(() => {
        this.refresh$.next();
      });
    }
    this.isConfirmModalVisible = false;
    this.taskIdToDelete = null;
  }
}
