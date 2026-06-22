import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, AsyncPipe, LoadingSpinnerComponent],
  template: `
    <router-outlet></router-outlet>
    <app-loading-spinner *ngIf="loading.isLoading$ | async"></app-loading-spinner>
  `
})
export class AppComponent {
  constructor(readonly loading: LoadingService) {}
}
