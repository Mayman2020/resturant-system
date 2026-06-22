import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConstants } from '../constants/app-constants';

@Injectable({ providedIn: 'root' })
export class BranchContextService {
  private readonly branchId$ = new BehaviorSubject<number>(this.readStored());

  get activeBranchId(): number {
    return this.branchId$.value;
  }

  setActiveBranchId(id: number): void {
    localStorage.setItem(AppConstants.PERSISTED_KEYS.ACTIVE_BRANCH_ID, String(id));
    this.branchId$.value !== id && this.branchId$.next(id);
  }

  asParam(): { branchId: number } {
    return { branchId: this.activeBranchId };
  }

  private readStored(): number {
    const raw = localStorage.getItem(AppConstants.PERSISTED_KEYS.ACTIVE_BRANCH_ID);
    const parsed = raw ? Number(raw) : 1;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }
}
