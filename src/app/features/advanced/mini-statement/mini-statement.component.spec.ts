import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MiniStatementComponent } from './mini-statement.component';
import { Account, Transaction } from '../../../core/models';

describe('MiniStatementComponent', () => {
  let component: MiniStatementComponent;
  let fixture: ComponentFixture<MiniStatementComponent>;

  const mockAccount: Account = {
    id: 'a1',
    customerId: 'c1',
    iban: 'EG380019000000000123456789',
    type: 'Current',
    balance: 1000,
    currency: 'EGP',
    status: 'Active',
    createdAt: ''
  };

  const mockTxs: Transaction[] = [
    { id: '1', accountId: 'a1', type: 'Debit', amount: 10, date: '2026-02-01', merchant: 'M1', category: 'Cat1', balanceAfter: 990 },
    { id: '2', accountId: 'a1', type: 'Credit', amount: 20, date: '2026-02-02', merchant: 'M2', category: 'Cat2', balanceAfter: 1010 },
    { id: '3', accountId: 'a1', type: 'Debit', amount: 30, date: '2026-02-03', merchant: 'M3', category: 'Cat1', balanceAfter: 980 },
    { id: '4', accountId: 'a1', type: 'Debit', amount: 40, date: '2026-02-04', merchant: 'M4', category: 'Cat1', balanceAfter: 940 },
    { id: '5', accountId: 'a1', type: 'Debit', amount: 50, date: '2026-02-05', merchant: 'M5', category: 'Cat1', balanceAfter: 890 },
    { id: '6', accountId: 'a1', type: 'Debit', amount: 60, date: '2026-02-06', merchant: 'M6', category: 'Cat1', balanceAfter: 830 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniStatementComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MiniStatementComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedAccount', mockAccount);
    fixture.componentRef.setInput('transactions', mockTxs);
    fixture.componentRef.setInput('limit', 5);
    fixture.detectChanges();
  });

  it('should create mini statement component', () => {
    expect(component).toBeTruthy();
  });

  it('should limit displayed recent transactions to specified limit (5)', () => {
    expect(component.recentTransactions().length).toBe(5);
    expect(component.recentTransactions()[0].merchant).toBe('M1');
  });

  it('should show empty notice when account is null', () => {
    fixture.componentRef.setInput('selectedAccount', null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No account selected');
  });
});
