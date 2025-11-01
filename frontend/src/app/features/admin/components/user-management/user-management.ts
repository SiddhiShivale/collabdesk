import { Component, OnInit } from '@angular/core';
import { User } from '../../../../core/models/user-model';
import { UserService } from '../../../../core/services/user';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagementComponent implements OnInit {
  pagedUsers$!: Observable<User[]>;
  private refresh$ = new BehaviorSubject<void>(undefined);

  isModalVisible = false;
  isConfirmModalVisible = false;
  isAlertVisible = false;
  alertTitle = '';
  alertMessage = '';

  userToToggle: User | null = null;
  userForm!: FormGroup;
  isEditMode = false;
  currentUserId: number | null = null;

  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  pageSizes = [10, 25, 50, 100];
  nameFilter = new FormControl('');
  emailFilter = new FormControl('');
  roleFilter = new FormControl('');
  statusFilter = new FormControl('');

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupDataStream();
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
      role: ['MEMBER', Validators.required],
    });
  }

  setupDataStream(): void {
    const filters$ = combineLatest([
      this.nameFilter.valueChanges.pipe(startWith('')),
      this.emailFilter.valueChanges.pipe(startWith('')),
      this.roleFilter.valueChanges.pipe(startWith('')),
      this.statusFilter.valueChanges.pipe(startWith('')),
    ]).pipe(debounceTime(100));

    const allUsers$ = this.refresh$.pipe(
      switchMap(() => this.userService.getAllUsers())
    );

    this.pagedUsers$ = combineLatest([allUsers$, filters$]).pipe(
      map(([users, [name, email, role, status]]) => {
        const filteredUsers = users.filter((user) => {
          const statusMatch =
            !status ||
            (status === 'ACTIVE' && !user.deleted && user.enabled) ||
            (status === 'INACTIVE' && user.deleted) ||
            (status === 'PENDING' && !user.deleted && !user.enabled);

          return (
            statusMatch &&
            user.name.toLowerCase().includes(name?.toLowerCase() ?? '') &&
            user.email.toLowerCase().includes(email?.toLowerCase() ?? '') &&
            (role ? user.role === role : true)
          );
        });

        this.totalElements = filteredUsers.length;

        const startIndex = this.currentPage * this.pageSize;
        return filteredUsers.slice(startIndex, startIndex + this.pageSize);
      })
    );
  }

  loadUsers(): void {
    this.refresh$.next();
  }

  handleToggleConfirmation(isConfirmed: boolean): void {
    if (isConfirmed && this.userToToggle) {
      this.userService.toggleUserActivation(this.userToToggle.id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => {
          this.alertTitle = 'Action Failed';
          this.alertMessage =
            err.error?.message ||
            'An error occurred while updating the user status.';
          this.isAlertVisible = true;
        },
      });
    }
    this.isConfirmModalVisible = false;
    this.userToToggle = null;
  }

  closeAlertModal(): void {
    this.isAlertVisible = false;
  }

  getUserStatus(user: User): 'Active' | 'Pending' | 'Inactive' {
    if (user.deleted) return 'Inactive';
    return user.enabled ? 'Active' : 'Pending';
  }

  getStatusColor(user: User): string {
    if (user.deleted) return 'text-red-700 bg-red-100';
    if (user.enabled) return 'text-green-700 bg-green-100';
    return 'text-yellow-700 bg-yellow-100';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
  onPageSizeChange(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 0;
  }
  openAddUserModal(): void {
    this.isEditMode = false;
    this.isModalVisible = true;
    this.userForm.reset({ role: 'MEMBER' });
  }
  openEditUserModal(user: User): void {
    this.isEditMode = true;
    this.isModalVisible = true;
    this.currentUserId = user.id;
    this.userForm.patchValue(user);
  }
  closeModal(): void {
    this.isModalVisible = false;
    this.currentUserId = null;
  }
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const apiCall$ =
      this.isEditMode && this.currentUserId
        ? this.userService.updateUser(this.currentUserId, this.userForm.value)
        : this.authService.register(this.userForm.value);
    apiCall$.subscribe({
      next: () => {
        this.loadUsers();
        this.closeModal();
      },
      error: (err) => alert(err.error?.message || 'An error occurred.'),
    });
  }
  toggleActivation(user: User): void {
    this.userToToggle = user;
    this.isConfirmModalVisible = true;
  }
}
