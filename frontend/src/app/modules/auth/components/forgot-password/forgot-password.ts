import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrls: ['../login/login.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  submitted = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = null;
    this.errorMessage = null;
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.authService.forgotPassword(this.f['email'].value).subscribe({
      next: () => {
        this.successMessage =
          'If an account exists, an OTP has been sent to your email.';
        this.submitted = false;
        this.forgotPasswordForm.reset();
      },
      error: () => {
        this.errorMessage = 'An error occurred. Please try again later.';
      },
    });
  }
}
