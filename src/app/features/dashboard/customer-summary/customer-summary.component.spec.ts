import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CustomerSummaryComponent } from './customer-summary.component';
import { Customer } from '../../../core/models';
import { LanguageService } from '../../../core/services/language.service';

describe('CustomerSummaryComponent', () => {
  let component: CustomerSummaryComponent;
  let fixture: ComponentFixture<CustomerSummaryComponent>;
  let langService: LanguageService;

  const mockCustomer: Customer = {
    CIF: 'c1',
    name: 'Ahmed Ali',
    nationalId: '29810251234567',
    segment: 'Retail',
    email: 'ahmed@mail.com',
    phone: '+20100000000'
  };

  beforeEach(async () => {
    localStorage.removeItem('app_lang');
    await TestBed.configureTestingModule({
      imports: [CustomerSummaryComponent]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');

    fixture = TestBed.createComponent(CustomerSummaryComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    langService.setLanguage('en');
    localStorage.removeItem('app_lang');
  });

  it('should display no-selection message when customer is null', () => {
    component.customer = null;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.no-selection')).not.toBeNull();
    expect(compiled.textContent).toContain('Select a customer');
  });

  it('should render customer details and financial metrics when customer is provided', () => {
    component.customer = mockCustomer;
    component.accountCount = 2;
    component.totalBalance = 62751.25;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ahmed Ali');
    expect(compiled.textContent).toContain('ahmed@mail.com');
    expect(compiled.textContent).toContain('62,751.25');
  });
});
