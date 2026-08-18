import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AccountListComponent } from './account-list.component';
import { Account } from '../../../core/models';

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;

  const mockAccounts: Account[] = [
    { id: 'a1', customerId: 'c1', iban: 'EG380019000000000123456789', type: 'Current', balance: 14500.5, currency: 'EGP', status: 'Active', createdAt: '' },
    { id: 'a2', customerId: 'c1', iban: 'EG380019000000000987654321', type: 'Savings', balance: 48250.75, currency: 'EGP', status: 'Active', createdAt: '' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
    component.accounts = mockAccounts;
    component.selectedAccountId = 'a1';
    fixture.detectChanges();
  });

  it('should create account list component', () => {
    expect(component).toBeTruthy();
  });

  it('should render account rows with formatted currency', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('EG380019000000000123456789');
    expect(compiled.textContent).toContain('EG380019000000000987654321');
    expect(compiled.textContent).toContain('14,500.50');
    expect(compiled.textContent).toContain('48,250.75');
  });

  it('should display empty notice if accounts array is empty', () => {
    fixture.componentRef.setInput('accounts', []);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-accounts')).not.toBeNull();
    expect(compiled.textContent).toContain('No banking accounts registered');
  });

  it('should emit accountSelect on button click', () => {
    spyOn(component.accountSelect, 'emit');
    component.selectAccount('a2');
    expect(component.accountSelect.emit).toHaveBeenCalledWith('a2');
  });
});
