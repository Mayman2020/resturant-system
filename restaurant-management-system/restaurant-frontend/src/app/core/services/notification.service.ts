import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { NotificationItem } from '../models/notification.model';

const STORAGE_KEY = 'rms_notifications_v1';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly items$ = new BehaviorSubject<NotificationItem[]>(this.readStored());

  constructor(private readonly api: ApiService) {}

  list(page = 0, size = 20): Observable<ApiResponse<PagedResponse<NotificationItem>>> {
    return this.api.get<ApiResponse<PagedResponse<NotificationItem>>>('/notifications', { page, size }).pipe(
      tap((res) => {
        if (res.data?.content?.length) {
          this.items$.next(res.data.content);
          this.persist(res.data.content);
        }
      }),
      catchError(() => of(this.pageLocal(page, size)))
    );
  }

  unreadCount(): Observable<ApiResponse<{ unreadCount: number }>> {
    return this.api.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count').pipe(
      catchError(() => of({ success: true, data: { unreadCount: this.unreadLocal() }, message: '', timestamp: '' }))
    );
  }

  markRead(id: number): Observable<ApiResponse<NotificationItem | null>> {
    const next = this.items$.value.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.items$.next(next);
    this.persist(next);
    return this.api.patch<ApiResponse<NotificationItem>>(`/notifications/${id}/read`, {}).pipe(
      catchError(() => of({ success: true, data: null, message: '', timestamp: '' }))
    );
  }

  markAllRead(): Observable<ApiResponse<void>> {
    const next = this.items$.value.map((n) => ({ ...n, read: true }));
    this.items$.next(next);
    this.persist(next);
    return this.api.patch<ApiResponse<void>>('/notifications/read-all', {}).pipe(
      catchError(() => of({ success: true, data: undefined, message: '', timestamp: '' }))
    );
  }

  seedSystemAlerts(alerts: Array<{ titleKey: string; bodyKey: string; referenceType?: string; referenceId?: number }>): void {
    const existing = this.items$.value;
    const merged = [...alerts.map((a, i) => ({
      id: Date.now() + i,
      titleKey: a.titleKey,
      bodyKey: a.bodyKey,
      read: false,
      createdAt: new Date().toISOString(),
      referenceType: a.referenceType,
      referenceId: a.referenceId
    })), ...existing].slice(0, 50);
    this.items$.next(merged);
    this.persist(merged);
  }

  private pageLocal(page: number, size: number): ApiResponse<PagedResponse<NotificationItem>> {
    const all = this.items$.value;
    const start = page * size;
    const content = all.slice(start, start + size);
    return {
      success: true,
      message: '',
      timestamp: new Date().toISOString(),
      data: { content, totalElements: all.length, totalPages: Math.max(1, Math.ceil(all.length / size)), size, number: page }
    };
  }

  private unreadLocal(): number {
    return this.items$.value.filter((n) => !n.read).length;
  }

  private readStored(): NotificationItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as NotificationItem[] : this.defaultSeed();
    } catch {
      return this.defaultSeed();
    }
  }

  private persist(items: NotificationItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private defaultSeed(): NotificationItem[] {
    const now = new Date().toISOString();
    return [
      { id: 1, titleKey: 'NOTIFICATIONS.WELCOME_TITLE', bodyKey: 'NOTIFICATIONS.WELCOME_BODY', read: false, createdAt: now },
      { id: 2, titleKey: 'NOTIFICATIONS.KITCHEN_TITLE', bodyKey: 'NOTIFICATIONS.KITCHEN_BODY', read: true, createdAt: now, referenceType: 'Order', referenceId: 1 }
    ];
  }
}
