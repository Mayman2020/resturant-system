export const ARABIC_LATIN_DIGITS_LANG = 'ar-u-nu-latnb';
export function formatNumberLatin(value: number | null | undefined, options?: Intl.NumberFormatOptions): string {
  if (value == null || Number.isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', options).format(value);
}
export function formatCurrencyLatin(value: number | null | undefined, currency = 'SAR', options?: Intl.NumberFormatOptions): string {
  return formatNumberLatin(value, { style: 'currency', currency, ...options });
}
export function formatDateTimeLatin(value: Date | string | number | null | undefined, options?: Intl.DateTimeFormatOptions, lang: 'ar' | 'en' = 'en'): string {
  if (value == null) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-GB', options ?? { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}
export function toLatinDigits(text: string | number | null | undefined): string {
  return String(text ?? '').replace(/[٠-٩۰-۹]/g, (ch) => String('0123456789'['٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹'.indexOf(ch) % 10]));
}
