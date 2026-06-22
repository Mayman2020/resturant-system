import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
@Injectable()
export class DateFormatAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'dd/MM/yyyy') {
      const d = date.getDate().toString().padStart(2, '0');
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${d}/${m}/${date.getFullYear()}`;
    }
    return super.format(date, displayFormat);
  }
}
