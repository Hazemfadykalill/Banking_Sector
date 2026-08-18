import { Injectable, signal, computed } from '@angular/core';
import { SupportedLanguage, TextDirection, TRANSLATIONS } from '../models/translations';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'app_lang';

  readonly currentLang = signal<SupportedLanguage>(this.getInitialLanguage());
  readonly currentDir = computed<TextDirection>(() => (this.currentLang() === 'ar' ? 'rtl' : 'ltr'));
  readonly isRtl = computed<boolean>(() => this.currentDir() === 'rtl');

  constructor() {
    this.applyLanguageAndDir(this.currentLang(), this.currentDir());
  }

  toggleLanguage(): void {
    const nextLang: SupportedLanguage = this.currentLang() === 'en' ? 'ar' : 'en';
    this.setLanguage(nextLang);
  }

  setLanguage(lang: SupportedLanguage): void {
    this.currentLang.set(lang);
    this.applyLanguageAndDir(lang, this.currentDir());
    try {
      localStorage.setItem(this.STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  }

  translate(key: string): string {
    const lang = this.currentLang();
    const dict = TRANSLATIONS[lang];
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Fallback to English
    const fallbackDict = TRANSLATIONS['en'];
    if (fallbackDict && fallbackDict[key] !== undefined) {
      return fallbackDict[key];
    }
    return key;
  }

  private getInitialLanguage(): SupportedLanguage {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'en';
  }

  private applyLanguageAndDir(lang: SupportedLanguage, dir: TextDirection): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('lang', lang);
      root.setAttribute('dir', dir);
    }
  }
}
