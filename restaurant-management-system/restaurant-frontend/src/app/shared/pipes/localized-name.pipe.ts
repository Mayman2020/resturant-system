import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

@Pipe({ name: 'localizedName', standalone: true, pure: false })
export class LocalizedNamePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(item: { name?: string; nameAr?: string; fullName?: string } | null | undefined): string {
    if (!item) return '';
    if (this.i18n.currentLang === 'ar' && item.nameAr) return item.nameAr;
    return item.name ?? item.fullName ?? '';
  }
}
