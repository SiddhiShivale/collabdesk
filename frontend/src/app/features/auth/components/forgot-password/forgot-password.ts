import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: { text: string; type: 'success' | 'error' } | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.message = null;
    const email = this.forgotPasswordForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.message = {
          text: 'If an account with that email exists, a password reset code has been sent.',
          type: 'success',
        };
        setTimeout(() => {
          this.router.navigate(['/reset-password'], {
            queryParams: { email: email },
          });
        }, 2000);
      },
      error: (err) => {
        this.message = {
          text: err.error?.message || 'An error occurred. Please try again.',
          type: 'error',
        };
        this.isSubmitting = false;
      },
    });
  }
}
