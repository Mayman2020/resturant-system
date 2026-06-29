/** Western digits (0–9) for all numeric display, including when UI language is Arabic. */
export const LATIN_NUMBER_LOCALE = 'en-US';

/** Arabic UI with Latin digits (browser typography). */
export const ARABIC_LATIN_DIGITS_LANG = 'ar-u-nu-latn';

export const DATE_DISPLAY_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
};

export const DATE_TIME_DISPLAY_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
};

export function toLatinDigits(text: string | number | null | undefined): string {
  return String(text ?? '')
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06F0));
}

export function formatNumberLatin(
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions
): string {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return toLatinDigits('0');
  }
  return toLatinDigits(new Intl.NumberFormat(LATIN_NUMBER_LOCALE, options).format(n));
}

export function formatCurrencyLatin(
  value: number | null | undefined,
  currency = 'SAR',
  options?: Intl.NumberFormatOptions
): string {
  return formatNumberLatin(value, { style: 'currency', currency, maximumFractionDigits: 0, ...options });
}

export function formatDateTimeLatin(
  value: Date | string | number | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  lang: 'ar' | 'en' = 'en'
): string {
  if (value == null || value === '') {
    return '-';
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  const locale = lang === 'ar' ? ARABIC_LATIN_DIGITS_LANG : 'en-GB';
  return toLatinDigits(new Intl.DateTimeFormat(locale, options).format(date));
}

export function formatDateLatin(
  value: Date | string | number | null | undefined,
  lang: 'ar' | 'en' = 'en'
): string {
  return formatDateTimeLatin(value, DATE_DISPLAY_OPTIONS, lang);
}
