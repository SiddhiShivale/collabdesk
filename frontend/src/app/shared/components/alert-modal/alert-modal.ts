import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-modal.html',
  styleUrls: ['./alert-modal.css'],
})
export class AlertModalComponent {
  @Input() title: string = 'Alert';
  @Input() message: string = 'An unexpected error occurred.';
  @Input() buttonText: string = 'OK';
  @Input() type: 'info' | 'error' | 'success' = 'error';

  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.closed.emit();
  }

  getIconColorClass(): string {
    switch (this.type) {
      case 'success':
        return 'text-green-600';
      case 'info':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
    }
  }
}
