import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideRouter([])
      ]
    });

    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with unauthenticated state when storage is empty', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.session()).toBeNull();
  });

  it('should reject login if email is missing or empty', () => {
    const result = service.login({ email: '', password: 'Password123!' });
    expect(result.success).toBeFalse();
    expect(result.error).toContain('Email is required');
  });

  it('should reject login if password is missing or empty', () => {
    const result = service.login({ email: 'ahmed.ali@mail.com', password: '   ' });
    expect(result.success).toBeFalse();
    expect(result.error).toContain('Password is required');
  });

  it('should authenticate successfully with valid credentials and persist session', () => {
    const result = service.login({ email: 'ahmed.ali@mail.com', password: 'Password123!' });

    expect(result.success).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.session()?.customer.name).toBe('Ahmed Ali');

    const storedSession = localStorage.getItem('banking_portal_session');
    expect(storedSession).not.toBeNull();
  });

  it('should clear session and navigate to /login on logout', () => {
    service.login({ email: 'ahmed.ali@mail.com', password: 'Password123!' });
    const spy = spyOn(router, 'navigate');

    service.logout();

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.session()).toBeNull();
    expect(localStorage.getItem('banking_portal_session')).toBeNull();
    expect(spy).toHaveBeenCalledWith(['/login']);
  });
});
