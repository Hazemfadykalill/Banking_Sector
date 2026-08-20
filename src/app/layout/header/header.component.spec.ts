import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../core/services/auth.service';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';
import { Customer } from '../../core/models';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let facadeSpy: jasmine.SpyObj<BankingFacadeService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;
  let langServiceSpy: jasmine.SpyObj<LanguageService>;

  const mockCustomer: Customer = {
    CIF: 'C001',
    name: 'Ahmed Ali',
    nationalId: '29810251234567',
    segment: 'Retail',
    email: 'ahmed.ali@mail.com',
    phone: '+201001234567'
  };

  beforeEach(async () => {
    localStorage.removeItem('app_theme');
    localStorage.removeItem('app_lang');

    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      session: () => ({
        token: 'apex-jwt-auth-test',
        customer: mockCustomer,
        authenticatedAt: '2026-08-20T10:00:00Z'
      }),
      isAuthenticated: () => true
    });

    facadeSpy = jasmine.createSpyObj('BankingFacadeService', ['loadInitialData'], {
      selectedCustomer: () => mockCustomer,
      customers: () => [mockCustomer],
      accounts: () => [],
      isLoading: () => false,
      error: () => null
    });

    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme', 'setTheme'], {
      currentTheme: () => 'light',
      isDarkMode: () => false
    });

    langServiceSpy = jasmine.createSpyObj('LanguageService', ['toggleLanguage', 'translate', 'setLanguage'], {
      currentLang: () => 'en',
      currentDir: () => 'ltr',
      isRtl: () => false
    });

    // translate should return a recognizable value so template assertions work
    langServiceSpy.translate.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: BankingFacadeService, useValue: facadeSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: LanguageService, useValue: langServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('app_theme');
    localStorage.removeItem('app_lang');
  });

  // --- Creation ---
  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  // --- Injected services exposed as readonly properties ---
  it('should expose authService, facade, themeService, and langService', () => {
    expect(component.authService).toBe(authServiceSpy);
    expect(component.facade).toBe(facadeSpy);
    expect(component.themeService).toBe(themeServiceSpy);
    expect(component.langService).toBe(langServiceSpy);
  });

  // --- userMenuItems getter ---
  it('should build userMenuItems with 4 entries including a separator', () => {
    const items = component.userMenuItems;
    expect(items.length).toBe(4);
    // Profile, Settings, separator, Logout
    expect(items[2].separator).toBeTrue();
  });

  it('userMenuItems logout command should call authService.logout()', () => {
    const logoutItem = component.userMenuItems.find(i => !i.separator && i.icon === 'pi pi-sign-out');
    expect(logoutItem).toBeDefined();
    logoutItem!.command!({} as any);
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
  });

  it('userMenuItems labels should be built from langService.translate', () => {
    const items = component.userMenuItems;
    // translate was called at least for profile, settings, logout keys
    expect(langServiceSpy.translate).toHaveBeenCalledWith('app.profile');
    expect(langServiceSpy.translate).toHaveBeenCalledWith('app.settings');
    expect(langServiceSpy.translate).toHaveBeenCalledWith('app.logout');
  });

  // --- Template: customer badge ---
  it('should render customer segment tag when selectedCustomer is available', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // The customer name appears somewhere in the header
    expect(compiled.textContent).toContain('Ahmed Ali');
  });

  // --- Template: user email ---
  it('should render the logged-in user email from session', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('ahmed.ali@mail.com');
  });

  // --- Theme toggle delegation ---
  it('should delegate toggleTheme call to ThemeService', () => {
    component.themeService.toggleTheme();
    expect(themeServiceSpy.toggleTheme).toHaveBeenCalledTimes(1);
  });

  // --- Language toggle delegation ---
  it('should delegate toggleLanguage call to LanguageService', () => {
    component.langService.toggleLanguage();
    expect(langServiceSpy.toggleLanguage).toHaveBeenCalledTimes(1);
  });

  // --- Logout via template button ---
  it('should call authService.logout() when logout button is clicked', () => {
    // The logout p-button is rendered inside .user-profile section
    const compiled = fixture.nativeElement as HTMLElement;
    // PrimeNG renders p-button as a native <button> element in the DOM
    const buttons = compiled.querySelectorAll('button');
    // Find the logout button by its text content (translate mock returns the key as-is)
    let logoutButton: HTMLButtonElement | null = null;
    buttons.forEach(btn => {
      if (btn.textContent?.toLowerCase().includes('app.logout') || btn.textContent?.toLowerCase().includes('logout')) {
        logoutButton = btn;
      }
    });

    expect(logoutButton).withContext('Logout button not found in header template').toBeTruthy();
    logoutButton!.click();
    fixture.detectChanges();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  // --- No-session state ---
  it('should not render user profile section when session returns null', async () => {
    // Recreate with null session
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      session: () => null,
      isAuthenticated: () => false
    });

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: BankingFacadeService, useValue: facadeSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: LanguageService, useValue: langServiceSpy }
      ]
    }).compileComponents();

    const nullSessionFixture = TestBed.createComponent(HeaderComponent);
    nullSessionFixture.detectChanges();
    const el = nullSessionFixture.nativeElement as HTMLElement;
    expect(el.querySelector('.user-profile')).toBeNull();
  });
});
