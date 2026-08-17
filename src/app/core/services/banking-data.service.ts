import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, catchError, throwError } from 'rxjs';
import { Customer, Account, Transaction, TransactionType, TransactionCategory } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BankingDataService {
  private readonly http = inject(HttpClient);
  private readonly basePath = 'assets/mock';

  // Cached observables to guarantee static JSON files are fetched only ONCE.
  private customers$?: Observable<Customer[]>;
  private accounts$?: Observable<Account[]>;
  private transactions$?: Observable<Transaction[]>;
  private transactionTypes$?: Observable<TransactionType[]>;
  private transactionCategories$?: Observable<TransactionCategory[]>;

  /**
   * Fetches and caches customer list.
   */
  getCustomers(): Observable<Customer[]> {
    if (!this.customers$) {
      this.customers$ = this.http.get<Customer[]>(`${this.basePath}/customers.json`).pipe(
        shareReplay(1),
        catchError(err => this.handleError('Failed to load customers data', err))
      );
    }
    return this.customers$;
  }

  /**
   * Fetches and caches account list.
   */
  getAccounts(): Observable<Account[]> {
    if (!this.accounts$) {
      this.accounts$ = this.http.get<Account[]>(`${this.basePath}/accounts.json`).pipe(
        shareReplay(1),
        catchError(err => this.handleError('Failed to load accounts data', err))
      );
    }
    return this.accounts$;
  }

  /**
   * Fetches and caches initial transaction dataset.
   */
  getTransactions(): Observable<Transaction[]> {
    if (!this.transactions$) {
      this.transactions$ = this.http.get<Transaction[]>(`${this.basePath}/transactions.json`).pipe(
        shareReplay(1),
        catchError(err => this.handleError('Failed to load transactions data', err))
      );
    }
    return this.transactions$;
  }

  /**
   * Fetches and caches transaction type metadata.
   */
  getTransactionTypes(): Observable<TransactionType[]> {
    if (!this.transactionTypes$) {
      this.transactionTypes$ = this.http.get<TransactionType[]>(`${this.basePath}/transaction-types.json`).pipe(
        shareReplay(1),
        catchError(err => this.handleError('Failed to load transaction types', err))
      );
    }
    return this.transactionTypes$;
  }

  /**
   * Fetches and caches transaction categories metadata.
   */
  getTransactionCategories(): Observable<TransactionCategory[]> {
    if (!this.transactionCategories$) {
      this.transactionCategories$ = this.http.get<TransactionCategory[]>(`${this.basePath}/transaction-categories.json`).pipe(
        shareReplay(1),
        catchError(err => this.handleError('Failed to load transaction categories', err))
      );
    }
    return this.transactionCategories$;
  }

  private handleError(message: string, error: unknown): Observable<never> {
    console.error(`[BankingDataService Error] ${message}:`, error);
    return throwError(() => new Error(message));
  }
}
