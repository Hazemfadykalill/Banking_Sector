import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BankingFacadeService } from './banking-facade.service';
import { BankingDataService } from './banking-data.service';
import { Customer, Account, Transaction } from '../models';

describe('BankingFacadeService', () => {
  let service: BankingFacadeService;
  let dataServiceSpy: jasmine.SpyObj<BankingDataService>;

  const mockCustomers: Customer[] = [
    { CIF: 'c1', name: 'John Doe', nationalId: '29810251234567', segment: 'Retail', email: 'john@example.com', phone: '+20100000000' }
  ];
  const mockAccounts: Account[] = [
    { id: 'a1', customerId: 'c1', iban: '12345', type: 'Current', balance: 1000, currency: 'EGP', status: 'Active', createdAt: '' }
  ];
  const mockTransactions: Transaction[] = [
    { id: 't1', accountId: 'a1', type: 'Credit', amount: 500, date: '2026-08-01', merchant: 'Salary', category: 'Salary', balanceAfter: 1000 }
  ];

  beforeEach(() => {
    dataServiceSpy = jasmine.createSpyObj('BankingDataService', [
      'getCustomers',
      'getAccounts',
      'getTransactions',
      'getTransactionCategories',
      'getTransactionTypes'
    ]);

    dataServiceSpy.getCustomers.and.returnValue(of(mockCustomers));
    dataServiceSpy.getAccounts.and.returnValue(of(mockAccounts));
    dataServiceSpy.getTransactions.and.returnValue(of(mockTransactions));
    dataServiceSpy.getTransactionCategories.and.returnValue(of([]));
    dataServiceSpy.getTransactionTypes.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        BankingFacadeService,
        { provide: BankingDataService, useValue: dataServiceSpy }
      ]
    });

    service = TestBed.inject(BankingFacadeService);
  });

  it('should initialize dataset signals correctly', () => {
    service.loadInitialData();
    expect(service.customers()).toEqual(mockCustomers);
    expect(service.accounts()).toEqual(mockAccounts);
    expect(service.selectedCustomer()).toEqual(mockCustomers[0]);
    expect(service.selectedAccount()).toEqual(mockAccounts[0]);
  });

  it('should enforce balance rule on debit transaction', () => {
    service.loadInitialData();

    // Debit amount (1500) exceeds current balance (1000)
    const result = service.addTransaction({
      accountId: 'a1',
      type: 'Debit',
      amount: 1500,
      date: '2026-08-17',
      merchant: 'ATM',
      category: 'Transfer'
    });

    expect(result.success).toBeFalse();
    expect(result.error).toContain('exceeds current account balance');
  });

  it('should update state and balance after valid transaction', () => {
    service.loadInitialData();

    const result = service.addTransaction({
      accountId: 'a1',
      type: 'Debit',
      amount: 200,
      date: '2026-08-17',
      merchant: 'Supermarket',
      category: 'Groceries'
    });

    expect(result.success).toBeTrue();
    expect(service.selectedAccount()?.balance).toBe(800);
    expect(service.transactions().length).toBe(2);
  });
});
