import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ShellComponent } from './shell.component';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { Customer, Account } from '../../core/models';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;
  let facadeSpy: jasmine.SpyObj<BankingFacadeService>;

  let isLoadingSignal = false;
  let errorSignal: string | null = null;

  const mockCustomer: Customer = { CIF: 'c1', name: 'Sarah Jenkins', nationalId: '29810251234567', segment: 'Retail', email: 'sarah@example.com', phone: '+20100000000' };
  const mockAccount: Account = { id: 'a1', customerId: 'c1', iban: 'EG380019000000000123456789', type: 'Current', balance: 1000, currency: 'EGP', status: 'Active', createdAt: '' };

  beforeEach(async () => {
    isLoadingSignal = false;
    errorSignal = null;

    facadeSpy = jasmine.createSpyObj('BankingFacadeService', ['loadInitialData', 'clearNotifications', 'markNotificationRead'], {
      isLoading: () => isLoadingSignal,
      error: () => errorSignal,
      selectedCustomer: () => mockCustomer,
      selectedAccount: () => mockAccount,
      notifications: () => [],
      unreadNotificationsCount: () => 0
    });

    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: BankingFacadeService, useValue: facadeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create shell component and load initial data on init', () => {
    expect(component).toBeTruthy();
    expect(facadeSpy.loadInitialData).toHaveBeenCalledTimes(1);
  });

  it('should render header, navigation, and router-outlet in normal state', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).not.toBeNull();
    expect(compiled.querySelector('app-navigation')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
    expect(compiled.querySelector('.loading-state')).toBeNull();
    expect(compiled.querySelector('.error-state')).toBeNull();
  });

  it('should render loading spinner when facade is loading', () => {
    isLoadingSignal = true;
    fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading-state')).not.toBeNull();
    expect(compiled.querySelector('p-progressspinner')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).toBeNull();
  });

  it('should render error message and retry button when facade has error', () => {
    errorSignal = 'Failed to load initial application data';
    fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-state')).not.toBeNull();
    expect(compiled.querySelector('p-message')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).toBeNull();
  });

  it('should trigger facade.loadInitialData when retry button is clicked', () => {
    errorSignal = 'Network timeout';
    fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();

    facadeSpy.loadInitialData.calls.reset();

    const retryButton = fixture.debugElement.query(By.css('.error-state p-button'));
    expect(retryButton).not.toBeNull();

    retryButton.triggerEventHandler('onClick', null);
    expect(facadeSpy.loadInitialData).toHaveBeenCalledTimes(1);
  });
});
