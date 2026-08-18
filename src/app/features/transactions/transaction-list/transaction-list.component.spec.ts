import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TransactionListComponent } from './transaction-list.component';
import { Transaction } from '../../../core/models';
import { LanguageService } from '../../../core/services/language.service';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let langService: LanguageService;

  const mockTxs: Transaction[] = [
    { id: 'tx1', accountId: 'a1', type: 'Debit', amount: 85.5, date: '2026-02-15T10:00:00Z', merchant: 'Supermarket', category: 'Groceries', balanceAfter: 14415.0 },
    { id: 'tx2', accountId: 'a1', type: 'Credit', amount: 500.0, date: '2026-02-16T12:00:00Z', merchant: 'Client Transfer', category: 'Income', balanceAfter: 14915.0 }
  ];

  beforeEach(async () => {
    localStorage.removeItem('app_lang');
    await TestBed.configureTestingModule({
      imports: [TransactionListComponent]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');

    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    component.transactions = mockTxs;
    fixture.detectChanges();
  });

  afterEach(() => {
    langService.setLanguage('en');
    localStorage.removeItem('app_lang');
  });

  it('should create transaction list component', () => {
    expect(component).toBeTruthy();
  });

  it('should render transaction rows with proper formatting', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Supermarket');
    expect(compiled.textContent).toContain('Client Transfer');
    expect(compiled.textContent).toContain('85.50');
    expect(compiled.textContent).toContain('500.00');
  });

  it('should show filtered empty notice when isFiltered is true and transactions are empty', () => {
    fixture.componentRef.setInput('transactions', []);
    fixture.componentRef.setInput('isFiltered', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No Matching Transactions');
  });

  it('should show account empty notice when isFiltered is false and transactions are empty', () => {
    fixture.componentRef.setInput('transactions', []);
    fixture.componentRef.setInput('isFiltered', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No Account Transactions');
  });
});
