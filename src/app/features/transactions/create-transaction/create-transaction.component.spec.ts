import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateTransactionComponent } from './create-transaction.component';
import { BankingFacadeService } from '../../../core/services/banking-facade.service';
import { LanguageService } from '../../../core/services/language.service';
import { Account } from '../../../core/models';

describe('CreateTransactionComponent', () => {
  let component: CreateTransactionComponent;
  let fixture: ComponentFixture<CreateTransactionComponent>;
  let facadeSpy: jasmine.SpyObj<BankingFacadeService>;
  let langService: LanguageService;

  const mockAccount: Account = {
    id: 'a1',
    customerId: 'c1',
    iban: 'EG380019000000000123456789',
    type: 'Current',
    balance: 1000.0,
    currency: 'EGP',
    status: 'Active',
    createdAt: ''
  };

  beforeEach(async () => {
    localStorage.removeItem('app_lang');
    facadeSpy = jasmine.createSpyObj('BankingFacadeService', ['addTransaction']);

    await TestBed.configureTestingModule({
      imports: [CreateTransactionComponent],
      providers: [
        { provide: BankingFacadeService, useValue: facadeSpy }
      ]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');

    fixture = TestBed.createComponent(CreateTransactionComponent);
    component = fixture.componentInstance;
    component.selectedAccount = mockAccount;
    component.categories = [{ id: '1', name: 'Groceries' }];
    component.types = [{ id: '1', name: 'Debit' }, { id: '2', name: 'Credit' }];
    fixture.detectChanges();
  });

  afterEach(() => {
    langService.setLanguage('en');
    localStorage.removeItem('app_lang');
  });

  it('should create create transaction component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate required fields', () => {
    component.txForm.patchValue({
      type: '',
      amount: null,
      merchant: '',
      category: ''
    });
    component.onSubmit();

    expect(component.txForm.invalid).toBeTrue();
    expect(facadeSpy.addTransaction).not.toHaveBeenCalled();
  });

  it('should reject debit amount exceeding account balance', () => {
    component.txForm.patchValue({
      type: 'Debit',
      amount: 1500, // Exceeds balance of 1000
      date: new Date(),
      merchant: 'Expensive Store',
      category: 'Groceries'
    });
    component.onSubmit();

    expect(component.txForm.invalid).toBeTrue();
    expect(component.submitError).toContain('exceeds current account balance');
    expect(facadeSpy.addTransaction).not.toHaveBeenCalled();
  });

  it('should reject future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    component.txForm.patchValue({
      type: 'Debit',
      amount: 100,
      date: futureDate,
      merchant: 'Store',
      category: 'Groceries'
    });

    expect(component.txForm.get('date')?.errors?.['futureDate']).toBeTrue();
  });

  it('should submit valid Debit transaction within balance', () => {
    facadeSpy.addTransaction.and.returnValue({
      success: true,
      transaction: {
        id: 'tx-123',
        accountId: 'a1',
        type: 'Debit',
        amount: 250,
        date: new Date().toISOString(),
        merchant: 'Grocery Store',
        category: 'Groceries',
        balanceAfter: 750
      }
    });

    component.txForm.patchValue({
      type: 'Debit',
      amount: 250,
      date: new Date(),
      merchant: 'Grocery Store',
      category: 'Groceries'
    });

    component.onSubmit();

    expect(facadeSpy.addTransaction).toHaveBeenCalledWith(jasmine.objectContaining({
      accountId: 'a1',
      type: 'Debit',
      amount: 250,
      merchant: 'Grocery Store'
    }));
    expect(component.submitSuccess).toContain('Transaction recorded successfully');
  });

  it('should submit valid Credit transaction adding to balance', () => {
    facadeSpy.addTransaction.and.returnValue({
      success: true,
      transaction: {
        id: 'tx-124',
        accountId: 'a1',
        type: 'Credit',
        amount: 500,
        date: new Date().toISOString(),
        merchant: 'Employer Inc',
        category: 'Income',
        balanceAfter: 1500
      }
    });

    component.txForm.patchValue({
      type: 'Credit',
      amount: 500,
      date: new Date(),
      merchant: 'Employer Inc',
      category: 'Income'
    });

    component.onSubmit();

    expect(facadeSpy.addTransaction).toHaveBeenCalledWith(jasmine.objectContaining({
      type: 'Credit',
      amount: 500
    }));
  });
});
