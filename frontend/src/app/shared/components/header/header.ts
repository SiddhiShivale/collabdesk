import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }
}
