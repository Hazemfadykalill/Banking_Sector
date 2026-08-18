import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { authGuard, publicGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('Auth Guards', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([])
      ]
    });

    router = TestBed.inject(Router);
  });

  describe('authGuard', () => {
    it('should allow navigation when authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() =>
        authGuard({} as any, { url: '/dashboard' } as any)
      );

      expect(result).toBeTrue();
    });

    it('should redirect to /login with returnUrl query parameter when unauthenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);

      const result = TestBed.runInInjectionContext(() =>
        authGuard({} as any, { url: '/accounts' } as any)
      );

      expect(result instanceof UrlTree).toBeTrue();
      const tree = result as UrlTree;
      expect(tree.toString()).toContain('/login?returnUrl=%2Faccounts');
    });
  });

  describe('publicGuard', () => {
    it('should allow access to public route when unauthenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);

      const result = TestBed.runInInjectionContext(() =>
        publicGuard({ queryParams: {} } as any, {} as any)
      );

      expect(result).toBeTrue();
    });

    it('should redirect authenticated users from /login to /dashboard', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() =>
        publicGuard({ queryParams: {} } as any, {} as any)
      );

      expect(result instanceof UrlTree).toBeTrue();
      const tree = result as UrlTree;
      expect(tree.toString()).toContain('/dashboard');
    });
  });
});
