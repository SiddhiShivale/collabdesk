import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Team } from '../../../../core/services/team';
import { TaskCreateDto, TaskService } from '../../../../core/services/task';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrls: ['../../../admin/components/user-form/user-form.css'],
})
export class TaskFormComponent implements OnInit {
  @Input() team!: Team;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  taskForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      assigneeIds: this.fb.array([], [Validators.required]),
    });
  }

  onAssigneeChange(event: Event): void {
    const assigneesArray = this.taskForm.get('assigneeIds') as FormArray;
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      assigneesArray.push(new FormControl(parseInt(checkbox.value, 10)));
    } else {
      const index = assigneesArray.controls.findIndex(
        (x) => x.value === parseInt(checkbox.value, 10)
      );
      assigneesArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const formValue = this.taskForm.value;
    const taskCreateDto: TaskCreateDto = {
      ...formValue,
      teamId: this.team.id,
    };

    this.taskService.createTask(taskCreateDto).subscribe({
      next: () => this.success.emit(),
      error: (err) =>
        (this.errorMessage = err.error?.message || 'Failed to create task.'),
    });
  }
}
