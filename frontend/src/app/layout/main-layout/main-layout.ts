import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, User } from '../../core/services/auth';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
})
export class MainLayoutComponent implements OnInit {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService['clearAuthState']();
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Logout failed but clearing session locally:', err); 
        this.authService['clearAuthState']();
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
