import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { AuthService } from '../../core/services/auth.service';
import { Customer, Account } from '../../core/models';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let facadeSpy: jasmine.SpyObj<BankingFacadeService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockCustomers: Customer[] = [
    { id: 'c1', name: 'Sarah Jenkins', email: 'sarah@example.com', tier: 'Premium VIP' }
  ];
  const mockAccounts: Account[] = [
    { id: 'a1', customerId: 'c1', accountNumber: 'CHK-101', accountType: 'Checking', balance: 10000, currency: 'USD', status: 'Active', createdAt: '' }
  ];

  beforeEach(async () => {
    facadeSpy = jasmine.createSpyObj(
      'BankingFacadeService',
      ['loadInitialData', 'selectCustomer', 'selectAccount'],
      {
        customers: () => mockCustomers,
        selectedCustomer: () => mockCustomers[0],
        accounts: () => mockAccounts,
        customerAccounts: () => mockAccounts,
        selectedAccount: () => mockAccounts[0],
        isLoading: () => false,
        error: () => null
      }
    );

    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      session: () => ({ customer: mockCustomers[0], token: 'tok', authenticatedAt: '' })
    });

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: BankingFacadeService, useValue: facadeSpy },
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create dashboard component and call loadInitialData on init', () => {
    expect(component).toBeTruthy();
    expect(facadeSpy.loadInitialData).toHaveBeenCalled();
  });

  it('should compute total portfolio balance correctly', () => {
    expect(component.totalPortfolioBalance()).toBe(10000);
  });

  it('should delegate customer selection to facade', () => {
    component.onCustomerSelect('c1');
    expect(facadeSpy.selectCustomer).toHaveBeenCalledWith('c1');
  });

  it('should delegate account selection to facade', () => {
    component.onAccountSelect('a1');
    expect(facadeSpy.selectAccount).toHaveBeenCalledWith('a1');
  });
});
