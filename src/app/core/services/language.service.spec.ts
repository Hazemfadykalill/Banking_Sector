import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    localStorage.removeItem('app_lang');
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
    service.setLanguage('en');
  });

  afterEach(() => {
    service.setLanguage('en');
    localStorage.removeItem('app_lang');
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to English and LTR', () => {
    expect(service.currentLang()).toBe('en');
    expect(service.currentDir()).toBe('ltr');
    expect(service.isRtl()).toBeFalse();
    expect(document.documentElement.getAttribute('lang')).toBe('en');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });

  it('should toggle language to Arabic and RTL', () => {
    service.toggleLanguage();
    expect(service.currentLang()).toBe('ar');
    expect(service.currentDir()).toBe('rtl');
    expect(service.isRtl()).toBeTrue();
    expect(document.documentElement.getAttribute('lang')).toBe('ar');
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
  });

  it('should translate keys correctly in English and Arabic', () => {
    expect(service.translate('app.title')).toBe('APEX');

    service.setLanguage('ar');
    expect(service.translate('app.title')).toBe('أبيكس');
  });

  it('should fall back to key if translation missing', () => {
    expect(service.translate('non.existent.key')).toBe('non.existent.key');
  });
});
