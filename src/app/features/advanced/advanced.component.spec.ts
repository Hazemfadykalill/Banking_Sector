import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdvancedComponent } from './advanced.component';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { Customer, Account, Transaction } from '../../core/models';

describe('AdvancedComponent', () => {
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>;
  let facadeSpy: jasmine.SpyObj<BankingFacadeService>;

  const mockCustomer: Customer = { CIF: 'c1', name: 'Sarah Jenkins', nationalId: '29810251234567', segment: 'Retail', email: 'sarah@example.com', phone: '+20100000000' };
  const mockAccount: Account = { id: 'a1', customerId: 'c1', iban: 'EG380019000000000123456789', type: 'Current', balance: 1000, currency: 'EGP', status: 'Active', createdAt: '' };
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
