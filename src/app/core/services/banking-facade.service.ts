import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin, tap } from 'rxjs';
import { BankingDataService } from './banking-data.service';
import {
  Customer,
  Account,
  Transaction,
  TransactionCategory,
  TransactionType,
  CreateTransactionRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class BankingFacadeService {
  private readonly dataService = inject(BankingDataService);

  // Private reactive signals (state)
  private readonly _customers = signal<Customer[]>([]);
  private readonly _selectedCustomer = signal<Customer | null>(null);
  private readonly _accounts = signal<Account[]>([]);
  private readonly _selectedAccount = signal<Account | null>(null);
  private readonly _transactions = signal<Transaction[]>([]);
  private readonly _categories = signal<TransactionCategory[]>([]);
  private readonly _types = signal<TransactionType[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly customers = this._customers.asReadonly();
  readonly selectedCustomer = this._selectedCustomer.asReadonly();
  readonly accounts = this._accounts.asReadonly();
  readonly selectedAccount = this._selectedAccount.asReadonly();
  readonly transactions = this._transactions.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly types = this._types.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed state derivations
  readonly customerAccounts = computed(() => {
    const cust = this._selectedCustomer();
    if (!cust) return [];
    return this._accounts().filter(a => a.customerId === cust.CIF);
  });

  readonly selectedAccountTransactions = computed(() => {
    const acc = this._selectedAccount();
    if (!acc) return [];
    return this._transactions().filter(t => t.accountId === acc.id);
  });

  /**
   * Initializes application static datasets once.
   */
  loadInitialData(): void {
    if (this._customers().length > 0) {
      return; // Already initialized
    }

    this._isLoading.set(true);
    this._error.set(null);

    forkJoin({
      customers: this.dataService.getCustomers(),
      accounts: this.dataService.getAccounts(),
      transactions: this.dataService.getTransactions(),
      categories: this.dataService.getTransactionCategories(),
      types: this.dataService.getTransactionTypes()
    }).pipe(
      tap(({ customers, accounts, transactions, categories, types }) => {
        this._customers.set(customers);
        this._accounts.set(accounts);
        this._transactions.set(transactions);
        this._categories.set(categories);
        this._types.set(types);

        // Auto-select first customer & first account for sensible default view
        if (customers.length > 0) {
          const firstCustomer = customers[0];
          this._selectedCustomer.set(firstCustomer);
          const firstCustAccounts = accounts.filter(a => a.customerId === firstCustomer.CIF);
          if (firstCustAccounts.length > 0) {
            this._selectedAccount.set(firstCustAccounts[0]);
          }
        }
        this._isLoading.set(false);
      })
    ).subscribe({
      error: (err) => {
        this._error.set(err.message || 'Failed to initialize banking datasets.');
        this._isLoading.set(false);
      }
    });
  }

  selectCustomer(customerId: string): void {
    const cust = this._customers().find(c => c.CIF === customerId) || null;
    this._selectedCustomer.set(cust);
    if (cust) {
      const custAccounts = this._accounts().filter(a => a.customerId === cust.CIF);
      this._selectedAccount.set(custAccounts.length > 0 ? custAccounts[0] : null);
    } else {
      this._selectedAccount.set(null);
    }
  }

  selectAccount(accountId: string): void {
    const acc = this._accounts().find(a => a.id === accountId) || null;
    this._selectedAccount.set(acc);
  }

  /**
   * Immediate optimistic transaction creation & balance update.
   * Enforces business rules and updates state in-memory without re-fetching JSON.
   */
  addTransaction(req: CreateTransactionRequest): { success: boolean; error?: string; transaction?: Transaction } {
    const currentAccount = this._accounts().find(a => a.id === req.accountId);
    if (!currentAccount) {
      return { success: false, error: 'Target account not found.' };
    }

    // Business Rule Check: Debit amount must not exceed balance
    if (req.type === 'Debit' && req.amount > currentAccount.balance) {
      return { success: false, error: `Debit amount ($${req.amount.toFixed(2)}) exceeds current account balance ($${currentAccount.balance.toFixed(2)}).` };
    }

    // Calculate new balance
    const newBalance = req.type === 'Debit'
      ? Number((currentAccount.balance - req.amount).toFixed(2))
      : Number((currentAccount.balance + req.amount).toFixed(2));

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      accountId: req.accountId,
      type: req.type,
      amount: req.amount,
      date: req.date,
      merchant: req.merchant.trim(),
      category: req.category,
      balanceAfter: newBalance,
      description: req.description?.trim()
    };

    // Update account balance
    const updatedAccounts = this._accounts().map(acc => {
      if (acc.id === req.accountId) {
        return { ...acc, balance: newBalance };
      }
      return acc;
    });

    // Update state signals atomically
    this._accounts.set(updatedAccounts);
    this._transactions.update(txs => [newTx, ...txs]);

    if (this._selectedAccount()?.id === req.accountId) {
      this._selectedAccount.update(acc => acc ? { ...acc, balance: newBalance } : null);
    }

    return { success: true, transaction: newTx };
  }

  clearError(): void {
    this._error.set(null);
  }
}
