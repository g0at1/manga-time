import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private idCounter = 0;
  private defaultDuration = 4000; // ms

  notifySuccess(message: string, duration = this.defaultDuration) {
    this.add('success', message, duration);
  }

  notifyError(message: string, duration = this.defaultDuration) {
    this.add('error', message, duration);
  }

  notifyInfo(message: string, duration = this.defaultDuration) {
    this.add('info', message, duration);
  }

  remove(id: number) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next(current.filter((n) => n.id !== id));
  }

  private add(type: NotificationType, message: string, duration: number) {
    const id = ++this.idCounter;
    const current = this.notificationsSubject.value;

    const notification: Notification = { id, type, message, duration };
    this.notificationsSubject.next([...current, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }
}
