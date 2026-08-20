import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AdvancedComponent } from './advanced.component';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { Customer, Account, Transaction } from '../../core/models';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

describe('AdvancedComponent', () => {
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>;
  let facadeSpy: jasmine.SpyObj<BankingFacadeService>;

  let isLoadingSignal = false;
  let errorSignal: string | null = null;
  let selectedAccountSignal: Account | null = null;
  let transactionsSignal: Transaction[] = [];

  const mockCustomer: Customer = { CIF: 'c1', name: 'Sarah Jenkins', nationalId: '29810251234567', segment: 'Retail', email: 'sarah@example.com', phone: '+20100000000' };
  const mockAccount: Account = { id: 'a1', customerId: 'c1', iban: 'EG380019000000000123456789', type: 'Current', balance: 1000, currency: 'EGP', status: 'Active', createdAt: '' };
  const mockTxs: Transaction[] = [
    { id: 'tx1', accountId: 'a1', type: 'Debit', amount: 50, date: '2026-02-10T10:00:00Z', merchant: 'Store', category: 'Groceries', balanceAfter: 950 }
  ];

  beforeEach(async () => {
    isLoadingSignal = false;
    errorSignal = null;
    selectedAccountSignal = mockAccount;
    transactionsSignal = mockTxs;

    facadeSpy = jasmine.createSpyObj('BankingFacadeService', ['loadInitialData'], {
      selectedCustomer: () => mockCustomer,
      selectedAccount: () => selectedAccountSignal,
      selectedAccountTransactions: () => transactionsSignal,
      isLoading: () => isLoadingSignal,
      error: () => errorSignal
    });

    await TestBed.configureTestingModule({
      imports: [AdvancedComponent],
      providers: [
        provideNoopAnimations(),
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

  it('should render mini statement and monthly insights child components with correct inputs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-mini-statement')).not.toBeNull();
    expect(compiled.querySelector('app-monthly-insights')).not.toBeNull();

    const miniStatementEl = fixture.debugElement.query(By.css('app-mini-statement'));
    expect(miniStatementEl.componentInstance.transactions()).toEqual(mockTxs);
    expect(miniStatementEl.componentInstance.selectedAccount()).toEqual(mockAccount);

    const insightsEl = fixture.debugElement.query(By.css('app-monthly-insights'));
    expect(insightsEl.componentInstance.transactions()).toEqual(mockTxs);
    expect(insightsEl.componentInstance.selectedAccount()).toEqual(mockAccount);
  });

  it('should render skeleton layout when facade is loading', () => {
    isLoadingSignal = true;
    fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.skeleton-layout')).not.toBeNull();
    expect(compiled.querySelector('app-mini-statement')).toBeNull();
    expect(compiled.querySelector('app-monthly-insights')).toBeNull();
  });

  it('should render error message and retry button when facade has error', () => {
    errorSignal = 'Failed to load advanced data';
    fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-wrapper')).not.toBeNull();
    expect(compiled.querySelector('p-message')).not.toBeNull();

    facadeSpy.loadInitialData.calls.reset();
    const retryBtn = fixture.debugElement.query(By.css('.error-wrapper p-button'));
    expect(retryBtn).not.toBeNull();

    retryBtn.triggerEventHandler('onClick', null);
    expect(facadeSpy.loadInitialData).toHaveBeenCalledTimes(1);
  });

  it('should disable CSV export button when no account or no transactions exist', () => {
    transactionsSignal = [];
    fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();

    const exportBtn = fixture.debugElement.query(By.css('.header-actions p-button'));
    expect(exportBtn.componentInstance.disabled).toBeTrue();
  });

  it('should trigger CSV download on onExportCsv execution', () => {
    const mockAnchor = document.createElement('a');
    const clickSpy = spyOn(mockAnchor, 'click');

    spyOn(document, 'createElement').and.callFake((tagName: string) => {
      if (tagName === 'a') return mockAnchor;
      return document.createElement(tagName);
    });

    spyOn(document.body, 'appendChild').and.callThrough();
    spyOn(document.body, 'removeChild').and.callThrough();
    spyOn(URL, 'createObjectURL').and.returnValue('blob:mock-url');
    spyOn(URL, 'revokeObjectURL');

    component.onExportCsv();

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(mockAnchor.getAttribute('download')).toContain('transactions-EG380019000000000123456789-');
  });
});
