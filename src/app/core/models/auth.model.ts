import { Customer } from './customer.model';

export interface UserSession {
  token: string;
  customer: Customer;
  authenticatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}
