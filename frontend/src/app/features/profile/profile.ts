import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile, ProfileService } from '../../core/services/profile';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  profileMessage: { text: string; type: 'success' | 'error' } | null = null;
  passwordMessage: { text: string; type: 'success' | 'error' } | null = null;

  activeTab: 'details' | 'password' = 'details';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadProfile();
  }

  initializeForms(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe((data) => {
      this.profile = data;
      this.profileForm.patchValue({
        name: data.name,
      });
    });
  }

  setActiveTab(tab: 'details' | 'password'): void {
    this.activeTab = tab;
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.profileMessage = null;
    const { name } = this.profileForm.value;
    this.profileService.updateProfile(name).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.authService.updateCurrentUser(updatedProfile);
        this.profileMessage = {
          text: 'Profile updated successfully!',
          type: 'success',
        };
        this.passwordMessage = null;
      },
      error: () => {
        this.profileMessage = {
          text: 'Failed to update profile.',
          type: 'error',
        };
      },
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.passwordMessage = null;
    this.profileService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.passwordMessage = {
          text: 'Password changed successfully!',
          type: 'success',
        };
        this.passwordForm.reset();
        this.profileMessage = null;
      },
      error: (err) => {
        this.passwordMessage = {
          text: err.error?.message || 'Failed to change password.',
          type: 'error',
        };
      },
    });
  }
}
