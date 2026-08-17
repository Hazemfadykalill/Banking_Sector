import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserSession, LoginCredentials, Customer } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly STORAGE_KEY = 'banking_portal_session';

  private readonly _session = signal<UserSession | null>(this.loadSessionFromStorage());

  readonly session = this._session.asReadonly();
  readonly isAuthenticated = signal<boolean>(!!this.loadSessionFromStorage());

  login(credentials: LoginCredentials, customerProfile?: Customer): boolean {
    const mockCustomer: Customer = customerProfile || {
      id: 'cust-001',
      name: 'Sarah Jenkins',
      email: credentials.email,
      tier: 'Premium VIP'
    };

    const newSession: UserSession = {
      token: `mock-jwt-token-${Date.now()}`,
      customer: mockCustomer,
      authenticatedAt: new Date().toISOString()
    };

    this._session.set(newSession);
    this.isAuthenticated.set(true);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newSession));
    return true;
  }

  logout(): void {
    this._session.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  private loadSessionFromStorage(): UserSession | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as UserSession;
      }
    } catch {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    return null;
  }
}
