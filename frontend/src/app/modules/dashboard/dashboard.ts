import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      switch (currentUser.role) {
        case 'ADMIN':
          this.router.navigate(['/admin']);
          break;
        case 'TEAM_LEAD':
          this.router.navigate(['/team-lead']);
          break;
        case 'MEMBER':
          this.router.navigate(['/member']);
          break;
      }
    }
  }
}
