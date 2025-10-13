import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Task,
  TaskCreateDto,
  TaskService,
  TaskStatus,
} from '../../../../core/services/task';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../../../core/services/auth';
import { Team, TeamService } from '../../../../core/services/team';
import { UserService } from '../../../../core/services/user';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrls: ['../user-form/user-form.css'],
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  taskForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private teamService: TeamService
  ) {}

  taskStatuses: TaskStatus[] = ['TO_DO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];

  users$!: Observable<User[]>;
  teams$!: Observable<Team[]>;

  ngOnInit(): void {
    this.isEditMode = !!this.task;

    this.loadDropdownData();
    this.initializeForm();

    if (this.isEditMode && this.task) {
      this.populateForm(this.task);
    }
  }

  loadDropdownData(): void {
    this.users$ = this.userService.getUsers();
    this.teams$ = this.teamService.getTeams();
  }

  initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      teamId: [null, Validators.required],
      assigneeIds: [[]],
      dueDate: [''],
      status: [this.taskStatuses[0]],
    });
  }

  populateForm(task: Task): void {
    const assigneeIds = task.assignees.map((a) => a.id);

    const formattedDueDate = task.dueDate
      ? new Date(task.dueDate).toISOString().split('T')[0]
      : '';

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      teamId: task.team.id,
      assigneeIds: assigneeIds,
      dueDate: formattedDueDate,
      status: task.status,
    });
  }
  onSubmit(): void {
    if (this.taskForm.invalid) {
      console.error('Form is invalid. Cannot submit.');
      return;
    }

    const formValue = this.taskForm.value;

    const apiDueDate = formValue.dueDate
      ? new Date(formValue.dueDate).toISOString()
      : undefined;

    if (this.isEditMode && this.task) {
      const taskId = this.task.id;

      const taskUpdatePayload: Task = {
        ...this.task,
        id: taskId,
        title: formValue.title,
        description: formValue.description,
        status: formValue.status,
        dueDate: apiDueDate || '',
        team: { ...this.task.team, id: formValue.teamId },
      };
    } else {
      const createTaskDto: TaskCreateDto = {
        title: formValue.title,
        description: formValue.description,
        teamId: formValue.teamId,
        assigneeIds: formValue.assigneeIds || [],
        dueDate: apiDueDate,
      };

      this.taskService.createTask(createTaskDto).subscribe({
        next: () => this.handleSuccess('Task created successfully!'),
        error: (err) => console.error('Error creating task:', err),
      });
    }
  }

  handleSuccess(message: string): void {
    console.log(message);
    this.success.emit();
    this.close.emit();
  }
}
