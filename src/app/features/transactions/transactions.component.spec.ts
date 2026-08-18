import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TransactionsComponent } from './transactions.component';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { Customer, Account, Transaction } from '../../core/models';

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;
  let facadeSpy: jasmine.SpyObj<BankingFacadeService>;

  const mockCustomer: Customer = { CIF: 'c1', name: 'Sarah Jenkins', nationalId: '29810251234567', segment: 'Retail', email: 'sarah@example.com', phone: '+20100000000' };
  const mockAccounts: Account[] = [
    { id: 'a1', customerId: 'c1', iban: 'EG380019000000000123456789', type: 'Current', balance: 1000, currency: 'EGP', status: 'Active', createdAt: '' }
  ];
  const mockTransactions: Transaction[] = [
    { id: 'tx1', accountId: 'a1', type: 'Debit', amount: 100, date: '2026-02-10T10:00:00Z', merchant: 'Grocery', category: 'Groceries', balanceAfter: 900 },
    { id: 'tx2', accountId: 'a1', type: 'Credit', amount: 500, date: '2026-02-12T10:00:00Z', merchant: 'Salary', category: 'Income', balanceAfter: 1400 }
  ];

  beforeEach(async () => {
    facadeSpy = jasmine.createSpyObj('BankingFacadeService', ['loadInitialData', 'selectAccount'], {
      selectedCustomer: () => mockCustomer,
      customerAccounts: () => mockAccounts,
      selectedAccount: () => mockAccounts[0],
      selectedAccountTransactions: () => mockTransactions,
      categories: () => [{ id: 'cat1', name: 'Groceries' }, { id: 'cat2', name: 'Income' }],
      types: () => [{ id: 't1', name: 'Debit' }, { id: 't2', name: 'Credit' }],
      isLoading: () => false,
      error: () => null
    });

    await TestBed.configureTestingModule({
      imports: [TransactionsComponent],
      providers: [
        { provide: BankingFacadeService, useValue: facadeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create transactions component and load initial data', () => {
    expect(component).toBeTruthy();
    expect(facadeSpy.loadInitialData).toHaveBeenCalled();
  });

  it('should compute filtered transactions correctly by type', () => {
    component.onFilterChange({ type: 'Debit' });
    expect(component.filteredTransactions().length).toBe(1);
    expect(component.filteredTransactions()[0].type).toBe('Debit');
  });

  it('should sort transactions by amount descending', () => {
    component.onFilterChange({ sortBy: 'amount', sortOrder: 'desc' });
    const txs = component.filteredTransactions();
    expect(txs[0].amount).toBe(500);
    expect(txs[1].amount).toBe(100);
  });

  it('should delegate account switching to facade', () => {
    component.onAccountSwitch('a1');
    expect(facadeSpy.selectAccount).toHaveBeenCalledWith('a1');
  });
});
