import { Component, signal } from '@angular/core';
import { AuthService } from './core/services/auth';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class AppComponent {
  title = 'CollabDesk';
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        if (
          event.url.includes('/login') ||
          event.url.includes('/setup-account')
        ) {
          this.isLoggedIn = false;
        } else {
          this.isLoggedIn = this.authService.isAuthenticated();
        }
      });
  }
}
