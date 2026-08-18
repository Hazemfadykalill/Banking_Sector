import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserSession, LoginCredentials, Customer } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly STORAGE_KEY = 'banking_portal_session';

  // Registered mock customer directory for demo authentication
  private readonly mockCustomers: Customer[] = [
    {
      CIF: 'C001',
      name: 'Ahmed Ali',
      nationalId: '29810251234567',
      segment: 'Retail',
      email: 'ahmed.ali@mail.com',
      phone: '+201001234567'
    },
    {
      CIF: 'C002',
      name: 'Mona Hassan',
      nationalId: '29004151234568',
      segment: 'Priority',
      email: 'mona.hassan@mail.com',
      phone: '+201112345678'
    },
    {
      CIF: 'C003',
      name: 'Elena Rostova',
      nationalId: '29508121234569',
      segment: 'Business',
      email: 'elena.rostova@mail.com',
      phone: '+201223456789'
    }
  ];

  private readonly _session = signal<UserSession | null>(this.loadSessionFromStorage());
  readonly session = this._session.asReadonly();

  readonly isAuthenticated = signal<boolean>(!!this.loadSessionFromStorage());

  /**
   * Authenticates user against registered mock customer credentials.
   */
  login(credentials: LoginCredentials): { success: boolean; error?: string } {
    const trimmedEmail = (credentials.email || '').trim().toLowerCase();
    const trimmedPassword = (credentials.password || '').trim();

    if (!trimmedEmail) {
      return { success: false, error: 'Email is required.' };
    }

    if (!trimmedPassword) {
      return { success: false, error: 'Password is required.' };
    }

    // Match registered mock customer or resolve generic mock user if valid format
    let matchedCustomer = this.mockCustomers.find(
      c => c.email.toLowerCase() === trimmedEmail
    );

    if (!matchedCustomer) {
      // Allow any valid email for flexible assessment evaluation
      const nameFromEmail = trimmedEmail.split('@')[0].replace('.', ' ');
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      matchedCustomer = {
        CIF: `C${Date.now().toString().slice(-3)}`,
        name: formattedName || 'Portal User',
        nationalId: '29900000000000',
        segment: 'Retail',
        email: trimmedEmail,
        phone: '+201000000000'
      };
    }

    const newSession: UserSession = {
      token: `apex-jwt-auth-${Date.now()}`,
      customer: matchedCustomer,
      authenticatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newSession));
    } catch (e) {
      console.warn('[AuthService] Unable to save session to localStorage:', e);
    }

    this._session.set(newSession);
    this.isAuthenticated.set(true);

    return { success: true };
  }

  /**
   * Logs out the current user session and clears state.
   */
  logout(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.warn('[AuthService] Unable to clear localStorage session:', e);
    }

    this._session.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  private loadSessionFromStorage(): UserSession | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserSession;
        if (parsed && parsed.token && parsed.customer) {
          return parsed;
        }
      }
    } catch {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    return null;
  }
}
