import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

export function passwordsMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  if (
    newPassword &&
    confirmPassword &&
    newPassword.value !== confirmPassword.value
  ) {
    return { passwordsMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  message: { text: string; type: 'success' | 'error' } | null = null;
  isSubmitting = false;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        otp: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        ],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
    if (!this.email) {
      this.message = {
        text: 'No email address provided. Please start the process again.',
        type: 'error',
      };
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid || !this.email) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.message = null;

    const payload = {
      email: this.email,
      otp: this.resetPasswordForm.value.otp,
      newPassword: this.resetPasswordForm.value.newPassword,
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.message = {
          text: 'Password has been reset successfully! Redirecting to login...',
          type: 'success',
        };
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.message = {
          text:
            err.error?.message ||
            'An error occurred. The OTP may be invalid or expired.',
          type: 'error',
        };
        this.isSubmitting = false;
      },
    });
  }
}
