import { Component, signal } from '@angular/core';
import { AuthService } from './core/services/auth';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { User } from './core/models/user-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class AppComponent {
  isLoggedIn = false;
  currentUser: User | null = null;
  isSidebarOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.isSidebarOpen = false;
        if (
          event.url.includes('/login') ||
          event.url.includes('/setup-account') ||
          event.url.includes('/forgot-password') ||
          event.url.includes('/reset-password')
        ) {
          this.isLoggedIn = false;
        } else {
          this.isLoggedIn = this.authService.isAuthenticated();
        }
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getDashboardLink(): string {
    if (!this.currentUser) return '/login';
    switch (this.currentUser.role) {
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
