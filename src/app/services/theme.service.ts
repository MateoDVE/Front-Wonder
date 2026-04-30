import { Injectable, PLATFORM_ID, inject, signal, effect } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly doc = inject(DOCUMENT);

  readonly isDark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const root = this.doc.documentElement;
        this.isDark() ? root.classList.add('dark') : root.classList.remove('dark');
      });
    }
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }
}
