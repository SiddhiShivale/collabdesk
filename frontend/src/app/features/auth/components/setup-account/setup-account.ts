import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-setup-account',
  standalone: false,
  templateUrl: './setup-account.html',
  styleUrl: './setup-account.css',
})
export class SetupAccountComponent implements OnInit {
  setupForm: FormGroup;
  token: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.setupForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage = 'No setup token provided. The link may be invalid.';
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.setupForm.invalid || !this.token) {
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = null;

    const { password } = this.setupForm.value;

    this.authService.setupAccount(this.token, password).subscribe({
      next: () => {
        this.successMessage =
          'Password set successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message ||
          'Failed to set password. The token might be invalid or expired.';
        this.isSubmitting = false;
      },
    });
  }
}
