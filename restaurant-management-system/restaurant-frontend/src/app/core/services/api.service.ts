import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../constants/app-constants';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = this.resolveApiBase();
  constructor(private readonly http: HttpClient) {}
  private resolveApiBase(): string {
    const runtime = (window as Window & { __RMS_API_URL__?: string }).__RMS_API_URL__;
    return runtime?.trim() || AppConstants.API.baseURL;
  }
  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v != null) httpParams = httpParams.set(k, String(v)); });
    return this.http.get<T>(`${this.base}${path}`, { params: httpParams });
  }
  post<T>(path: string, body: unknown): Observable<T> { return this.http.post<T>(`${this.base}${path}`, body); }
  put<T>(path: string, body: unknown): Observable<T> { return this.http.put<T>(`${this.base}${path}`, body); }
  patch<T>(path: string, body?: unknown, params?: Record<string, string | number | boolean>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v != null) httpParams = httpParams.set(k, String(v)); });
    return this.http.patch<T>(`${this.base}${path}`, body ?? {}, { params: httpParams });
  }
  delete<T>(path: string): Observable<T> { return this.http.delete<T>(`${this.base}${path}`); }
  buildUrl(path: string): string { return `${this.base}${path}`; }
}
