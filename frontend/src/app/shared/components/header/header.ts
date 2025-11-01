import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../core/models/user-model';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getDashboardLink(): string {
    const user = this.authService.getCurrentUser();
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'TEAM_LEAD':
        return '/team-lead/dashboard';
      case 'MEMBER':
        return '/member/my-tasks';
      default:
        return '/login';
    }
  }
}
