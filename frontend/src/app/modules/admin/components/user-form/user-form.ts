import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../core/services/auth';
import {
  UserCreateDto,
  UserService,
  UserUpdateDto,
} from '../../../../core/services/user';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css'],
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  userForm!: FormGroup;
  isEditMode = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.isEditMode = !!this.user;
    this.userForm = this.fb.group({
      name: [this.user?.name || '', Validators.required],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      role: [this.user?.role || 'MEMBER', Validators.required],
      password: [
        '',
        this.isEditMode ? [] : [Validators.required, Validators.minLength(8)],
      ],
    });
    if (this.isEditMode) {
      this.userForm.get('email')?.disable();
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;
    this.errorMessage = null;
    const formValue = this.userForm.getRawValue();

    if (this.isEditMode && this.user) {
      const dto: UserUpdateDto = {
        name: formValue.name,
        email: formValue.email,
        role: formValue.role,
      };
      this.userService.updateUser(this.user.id, dto).subscribe({
        next: () => this.success.emit(),
        error: (err) =>
          (this.errorMessage = err.error?.message || 'Failed to update user.'),
      });
    } else {
      const dto: UserCreateDto = formValue;
      this.userService.createUser(dto).subscribe({
        next: () => this.success.emit(),
        error: (err) =>
          (this.errorMessage = err.error?.message || 'Failed to create user.'),
      });
    }
  }
}
