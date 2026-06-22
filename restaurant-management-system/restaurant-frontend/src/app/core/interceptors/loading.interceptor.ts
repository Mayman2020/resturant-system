import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { shouldSkipGlobalLoaderForUpload } from '../constants/app-constants';
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url ?? '';
  const method = req.method.toUpperCase();
  if (url.includes('/assets/') || method === 'GET' || url.includes('/auth/login') || shouldSkipGlobalLoaderForUpload(url, method)) {
    return next(req);
  }
  const loading = inject(LoadingService);
  loading.show();
  return next(req).pipe(finalize(() => loading.hide()));
};
