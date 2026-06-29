import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BehaviorSubject } from 'rxjs';
import { AppConstants } from '../constants/app-constants';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly subject = new BehaviorSubject<ThemeMode>(this.readInitial());
  readonly isDark$ = this.subject.asObservable();

  constructor(private readonly overlay: OverlayContainer) {
    this.apply(this.subject.value);
  }

  get mode(): ThemeMode {
    return this.subject.value;
  }

  get isDark(): boolean {
    return this.mode === 'dark';
  }

  toggle(): void {
    this.setTheme(this.mode === 'dark' ? 'light' : 'dark');
  }

  setTheme(mode: ThemeMode): void {
    this.subject.next(mode);
    localStorage.setItem(AppConstants.PERSISTED_KEYS.THEME, mode);
    this.apply(mode);
  }

  private readInitial(): ThemeMode {
    const saved = localStorage.getItem(AppConstants.PERSISTED_KEYS.THEME) as ThemeMode | null;
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  }

  private apply(mode: ThemeMode): void {
    const isDark = mode === 'dark';
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('light-theme', !isDark);
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
    try {
      const overlayEl = this.overlay.getContainerElement();
      overlayEl.classList.toggle('dark-theme', isDark);
      overlayEl.classList.toggle('light-theme', !isDark);
    } catch {
      /* overlay container not ready during bootstrap */
    }
  }
}
