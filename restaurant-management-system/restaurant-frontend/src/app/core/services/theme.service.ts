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
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  private apply(mode: ThemeMode): void {
    const el = document.documentElement;
    const overlay = this.overlay.getContainerElement();
    const body = document.body;
    if (mode === 'dark') {
      el.classList.add('dark-theme');
      overlay.classList.add('dark-theme');
      body.classList.add('dark-theme');
    } else {
      el.classList.remove('dark-theme');
      overlay.classList.remove('dark-theme');
      body.classList.remove('dark-theme');
    }
  }
}
