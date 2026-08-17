import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdvancedComponent } from './advanced.component';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { Customer, Account, Transaction } from '../../core/models';

describe('AdvancedComponent', () => {
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>;
  let facadeSpy: jasmine.SpyObj<BankingFacadeService>;

  const mockCustomer: Customer = { id: 'c1', name: 'Sarah Jenkins', email: 'sarah@example.com' };
  const mockAccount: Account = { id: 'a1', customerId: 'c1', accountNumber: 'CHK-101', accountType: 'Checking', balance: 1000, currency: 'USD', status: 'Active', createdAt: '' };
  const mockTxs: Transaction[] = [
    { id: 'tx1', accountId: 'a1', type: 'Debit', amount: 50, date: '2026-02-10T10:00:00Z', merchant: 'Store', category: 'Groceries', balanceAfter: 950 }
  ];

  beforeEach(async () => {
    facadeSpy = jasmine.createSpyObj('BankingFacadeService', ['loadInitialData'], {
      selectedCustomer: () => mockCustomer,
      selectedAccount: () => mockAccount,
      selectedAccountTransactions: () => mockTxs,
      isLoading: () => false,
      error: () => null
    });

    await TestBed.configureTestingModule({
      imports: [AdvancedComponent],
      providers: [
        { provide: BankingFacadeService, useValue: facadeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create advanced component and load initial data', () => {
    expect(component).toBeTruthy();
    expect(facadeSpy.loadInitialData).toHaveBeenCalled();
  });

  it('should render mini statement and monthly insights child components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-mini-statement')).not.toBeNull();
    expect(compiled.querySelector('app-monthly-insights')).not.toBeNull();
  });
});
