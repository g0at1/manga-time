import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NotificationService, Notification } from '../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="notifications$ | async as notifications">
      <div *ngFor="let n of notifications" class="toast" [ngClass]="'toast--' + n.type">
        <div class="toast__icon" [ngClass]="'toast__icon--' + n.type">
          <span *ngIf="n.type === 'success'">✓</span>
          <span *ngIf="n.type === 'error'">✕</span>
          <span *ngIf="n.type === 'info'">i</span>
        </div>

        <div class="toast__body">
          <span class="toast__message">{{ n.message }}</span>
          <div class="toast__bar" [style.animation-duration.ms]="n.duration"></div>
        </div>

        <button class="toast__close" (click)="close(n.id)">×</button>
      </div>
    </div>
  `,
  styleUrls: ['./toast-container.component.scss'],
})
export class ToastContainerComponent implements OnInit {
  notifications$!: Observable<Notification[]>;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationService.notifications$;
  }

  close(id: number) {
    this.notificationService.remove(id);
  }
}
