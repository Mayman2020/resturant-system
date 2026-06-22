import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedNamePipe } from '../../shared/pipes/localized-name.pipe';
import { MenuService } from '../../core/services/menu.service';
import { MenuCategory, MenuItem, QrMenu } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-qr-menu',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, TranslateModule, LocalizedNamePipe],
  templateUrl: './qr-menu.component.html',
  styleUrl: './qr-menu.component.scss'
})
export class QrMenuComponent implements OnInit {
  menu: QrMenu | null = null;
  loading = true;
  error = false;
  selectedCategoryId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly menuSvc: MenuService
  ) {}

  ngOnInit(): void {
    const qrCode = this.route.snapshot.paramMap.get('qrCode');
    if (!qrCode) {
      this.loading = false;
      this.error = true;
      return;
    }
    this.menuSvc.getQrMenu(qrCode).subscribe({
      next: (r) => {
        this.menu = r.data ?? null;
        if (this.menu?.categories?.length) {
          this.selectedCategoryId = this.menu.categories[0].id;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  itemsForCategory(categoryId: number | null): MenuItem[] {
    if (!this.menu || categoryId == null) return [];
    return this.menu.items.filter((i) => i.categoryId === categoryId);
  }

  selectCategory(cat: MenuCategory): void {
    this.selectedCategoryId = cat.id;
  }
}
