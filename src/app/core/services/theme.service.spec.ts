import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.removeItem('app_theme');
    document.documentElement.classList.remove('app-dark');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    service.setTheme('light');
  });

  afterEach(() => {
    localStorage.removeItem('app_theme');
    document.documentElement.classList.remove('app-dark');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to light theme', () => {
    expect(service.currentTheme()).toBe('light');
    expect(service.isDarkMode()).toBeFalse();
    expect(document.documentElement.classList.contains('app-dark')).toBeFalse();
  });

  it('should toggle theme correctly', () => {
    service.toggleTheme();
    expect(service.currentTheme()).toBe('dark');
    expect(service.isDarkMode()).toBeTrue();
    expect(document.documentElement.classList.contains('app-dark')).toBeTrue();

    service.toggleTheme();
    expect(service.currentTheme()).toBe('light');
    expect(service.isDarkMode()).toBeFalse();
    expect(document.documentElement.classList.contains('app-dark')).toBeFalse();
  });

  it('should persist theme to localStorage', () => {
    service.setTheme('dark');
    expect(localStorage.getItem('app_theme')).toBe('dark');
  });
});
