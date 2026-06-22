import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConstants } from '../constants/app-constants';
import { ARABIC_LATIN_DIGITS_LANG, formatCurrencyLatin, formatDateTimeLatin, formatNumberLatin, toLatinDigits as toLatinDigitsFn } from './locale-format';

export type LangCode = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly languages = [
    { code: 'ar' as LangCode, nativeLabel: 'العربية', dir: 'rtl' as Direction, flagUrl: 'assets/flags/sa.svg' },
    { code: 'en' as LangCode, nativeLabel: 'English', dir: 'ltr' as Direction, flagUrl: 'assets/flags/gb.svg' }
  ];
  constructor(private readonly translate: TranslateService, private readonly overlay: OverlayContainer) {
    this.translate.addLangs(['ar', 'en']);
    this.translate.setDefaultLang('ar');
    this.setLang(this.readSaved()).subscribe({ error: () => {} });
  }
  get currentLang(): LangCode { return (this.translate.currentLang as LangCode) || 'ar'; }
  get isRtl(): boolean { return this.currentLang === 'ar'; }
  setLang(code: LangCode): Observable<unknown> {
    localStorage.setItem(AppConstants.PERSISTED_KEYS.LANG, code);
    this.apply(code);
    return this.translate.use(code).pipe(tap(() => {
      const t = this.translate.instant('APP.TAGLINE');
      if (t && t !== 'APP.TAGLINE') document.title = t;
    }));
  }
  instant(key: string, params?: Record<string, unknown>): string { return this.translate.instant(key, params); }
  formatNumber(v: number | null | undefined, o?: Intl.NumberFormatOptions): string { return formatNumberLatin(v, o); }
  formatCurrency(v: number | null | undefined, c = 'SAR'): string { return formatCurrencyLatin(v, c); }
  formatDateTime(v: Date | string | number | null | undefined, o?: Intl.DateTimeFormatOptions): string {
    return formatDateTimeLatin(v, o, this.currentLang);
  }
  toLatinDigits(t: string | number | null | undefined): string { return toLatinDigitsFn(t); }
  private apply(code: LangCode): void {
    const lang = this.languages.find((l) => l.code === code) ?? this.languages[0];
    const htmlLang = code === 'ar' ? ARABIC_LATIN_DIGITS_LANG : 'en';
    document.documentElement.setAttribute('dir', lang.dir);
    document.documentElement.setAttribute('lang', htmlLang);
    document.body.setAttribute('dir', lang.dir);
    this.overlay.getContainerElement().setAttribute('dir', lang.dir);
  }
  private readSaved(): LangCode {
    const s = localStorage.getItem(AppConstants.PERSISTED_KEYS.LANG);
    return s === 'en' ? 'en' : 'ar';
  }
}
