import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BankingDataService } from './banking-data.service';

describe('BankingDataService', () => {
  let service: BankingDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BankingDataService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(BankingDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // -------------------------------------------------------------------------
  // getCustomers
  // -------------------------------------------------------------------------
  it('should fetch and cache customers via shareReplay(1)', () => {
    const mockCustomers = [
      { id: 'cust-1', name: 'Test Customer', email: 'test@example.com' }
    ];

    let response1: any;
    let response2: any;

    service.getCustomers().subscribe(res => response1 = res);
    service.getCustomers().subscribe(res => response2 = res);

    const req = httpMock.expectOne('assets/mock/customers.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);

    expect(response1).toEqual(mockCustomers);
    expect(response2).toEqual(mockCustomers);
  });

  it('should propagate a user-readable error when getCustomers HTTP request fails', () => {
    let errorMessage: string | undefined;

    service.getCustomers().subscribe({
      next: () => fail('expected an error, not data'),
      error: (err: Error) => { errorMessage = err.message; }
    });

    const req = httpMock.expectOne('assets/mock/customers.json');
    req.flush('Network error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorMessage).toBe('Failed to load customers data');
  });

  // -------------------------------------------------------------------------
  // getAccounts
  // -------------------------------------------------------------------------
  it('should fetch accounts and return an array', () => {
    const mockAccounts = [
      { id: 'a1', customerId: 'c1', type: 'Current', balance: 1000, currency: 'EGP', status: 'Active' }
    ];
    let result: any;

    service.getAccounts().subscribe(res => result = res);

    const req = httpMock.expectOne('assets/mock/accounts.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockAccounts);

    expect(result).toEqual(mockAccounts);
  });

  it('should cache accounts so the second call does not trigger a new HTTP request', () => {
    let r1: any;
    let r2: any;

    service.getAccounts().subscribe(res => r1 = res);
    service.getAccounts().subscribe(res => r2 = res);

    const req = httpMock.expectOne('assets/mock/accounts.json');
    req.flush([{ id: 'a1' }]);

    expect(r1).toEqual(r2);
  });

  it('should propagate a user-readable error when getAccounts HTTP request fails', () => {
    let errorMessage: string | undefined;

    service.getAccounts().subscribe({
      next: () => fail('expected an error'),
      error: (err: Error) => { errorMessage = err.message; }
    });

    httpMock.expectOne('assets/mock/accounts.json')
      .flush(null, { status: 404, statusText: 'Not Found' });

    expect(errorMessage).toBe('Failed to load accounts data');
  });

  // -------------------------------------------------------------------------
  // getTransactions
  // -------------------------------------------------------------------------
  it('should fetch transactions and return an array', () => {
    const mockTransactions = [
      { id: 'tx1', accountId: 'a1', type: 'Debit', amount: 100, date: '2026-01-01', merchant: 'Store', category: 'Groceries', balanceAfter: 900 }
    ];
    let result: any;

    service.getTransactions().subscribe(res => result = res);

    const req = httpMock.expectOne('assets/mock/transactions.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTransactions);

    expect(result).toEqual(mockTransactions);
  });

  it('should propagate a user-readable error when getTransactions HTTP request fails', () => {
    let errorMessage: string | undefined;

    service.getTransactions().subscribe({
      next: () => fail('expected an error'),
      error: (err: Error) => { errorMessage = err.message; }
    });

    httpMock.expectOne('assets/mock/transactions.json')
      .flush(null, { status: 0, statusText: 'Unknown Error' });

    expect(errorMessage).toBe('Failed to load transactions data');
  });

  // -------------------------------------------------------------------------
  // getTransactionTypes
  // -------------------------------------------------------------------------
  it('should fetch transaction types and return an array', () => {
    const mockTypes = [{ id: 't1', name: 'Debit' }, { id: 't2', name: 'Credit' }];
    let result: any;

    service.getTransactionTypes().subscribe(res => result = res);

    const req = httpMock.expectOne('assets/mock/transaction-types.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTypes);

    expect(result).toEqual(mockTypes);
  });

  it('should propagate a user-readable error when getTransactionTypes HTTP request fails', () => {
    let errorMessage: string | undefined;

    service.getTransactionTypes().subscribe({
      next: () => fail('expected an error'),
      error: (err: Error) => { errorMessage = err.message; }
    });

    httpMock.expectOne('assets/mock/transaction-types.json')
      .flush(null, { status: 503, statusText: 'Service Unavailable' });

    expect(errorMessage).toBe('Failed to load transaction types');
  });

  // -------------------------------------------------------------------------
  // getTransactionCategories
  // -------------------------------------------------------------------------
  it('should fetch transaction categories and return an array', () => {
    const mockCategories = [{ id: 'cat1', name: 'Groceries' }, { id: 'cat2', name: 'Bills' }];
    let result: any;

    service.getTransactionCategories().subscribe(res => result = res);

    const req = httpMock.expectOne('assets/mock/transaction-categories.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);

    expect(result).toEqual(mockCategories);
  });

  it('should propagate a user-readable error when getTransactionCategories HTTP request fails', () => {
    let errorMessage: string | undefined;

    service.getTransactionCategories().subscribe({
      next: () => fail('expected an error'),
      error: (err: Error) => { errorMessage = err.message; }
    });

    httpMock.expectOne('assets/mock/transaction-categories.json')
      .flush(null, { status: 500, statusText: 'Internal Server Error' });

    expect(errorMessage).toBe('Failed to load transaction categories');
  });
});
