import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/** Translates backend enum values like PENDING, DINE_IN using ORDERS.* / TABLES.* / DELIVERY.* keys */
@Pipe({ name: 'enumTranslate', standalone: true, pure: false })
export class EnumTranslatePipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(value: string | null | undefined, group: 'ORDERS' | 'TABLES' | 'DELIVERY' | 'ROLE' | 'POS' = 'ORDERS'): string {
    if (!value) return '';
    const key = `${group}.${value}`;
    const translated = this.translate.instant(key);
    return translated !== key ? translated : value.replace(/_/g, ' ');
  }
}
