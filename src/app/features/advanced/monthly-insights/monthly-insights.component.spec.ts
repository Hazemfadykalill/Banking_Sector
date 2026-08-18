import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MonthlyInsightsComponent } from './monthly-insights.component';
import { Account, Transaction } from '../../../core/models';

describe('MonthlyInsightsComponent', () => {
  let component: MonthlyInsightsComponent;
  let fixture: ComponentFixture<MonthlyInsightsComponent>;

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
    { id: '1', accountId: 'a1', type: 'Credit', amount: 1000, date: '2026-01-15T10:00:00Z', merchant: 'Salary', category: 'Income', balanceAfter: 1000 },
    { id: '2', accountId: 'a1', type: 'Debit', amount: 300, date: '2026-01-20T10:00:00Z', merchant: 'Supermarket', category: 'Groceries', balanceAfter: 700 },
    { id: '3', accountId: 'a1', type: 'Debit', amount: 200, date: '2026-02-10T10:00:00Z', merchant: 'Electric Co', category: 'Bills', balanceAfter: 500 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyInsightsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyInsightsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedAccount', mockAccount);
    fixture.componentRef.setInput('transactions', mockTxs);
    fixture.detectChanges();
  });

  it('should create monthly insights component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate overall credits, debits, and net cash flow accurately', () => {
    expect(component.totalCreditsAllTime()).toBe(1000);
    expect(component.totalDebitsAllTime()).toBe(500);
    expect(component.netCashFlowAllTime()).toBe(500);
  });

  it('should group transactions into monthly analytics correctly', () => {
    const analytics = component.monthlyAnalytics();
    expect(analytics.length).toBe(2);
    // Most recent month first (February 2026)
    expect(analytics[0].monthKey).toBe('2026-02');
    expect(analytics[0].totalDebits).toBe(200);

    // January 2026
    expect(analytics[1].monthKey).toBe('2026-01');
    expect(analytics[1].totalCredits).toBe(1000);
    expect(analytics[1].totalDebits).toBe(300);
    expect(analytics[1].netCashFlow).toBe(700);
  });

  it('should identify top spending category from Debit transactions', () => {
    const topCat = component.topSpendingCategory();
    expect(topCat).not.toBeNull();
    expect(topCat?.category).toBe('Groceries');
    expect(topCat?.amount).toBe(300);
  });
});
