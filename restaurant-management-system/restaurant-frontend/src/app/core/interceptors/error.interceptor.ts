import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
import { AppConstants } from '../constants/app-constants';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storage = inject(TokenStorageService);
  const translate = inject(TranslateService);

  return next(req).pipe(catchError((err: HttpErrorResponse) => {
    if (err.status === 401 && !req.url.includes(AppConstants.API.AUTH_LOGIN)) {
      storage.clearAll();
      void router.navigateByUrl('/auth/login');
    }

    let msg: string;
    if (err.status === 0) {
      msg = translate.instant('ERRORS.NETWORK');
    } else if (err.status === 401) {
      msg = translate.instant('ERRORS.UNAUTHORIZED');
    } else {
      const apiMsg = (err.error as { message?: string })?.message;
      msg = apiMsg || translate.instant('ERRORS.REQUEST_FAILED');
    }

    return throwError(() => Object.assign(new Error(msg), { status: err.status }));
  }));
};
