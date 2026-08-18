import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CustomerListComponent } from './customer-list.component';
import { Customer } from '../../../core/models';

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;

  const mockCustomers: Customer[] = [
    { CIF: 'c1', name: 'Ahmed Ali', nationalId: '29810251234567', segment: 'Retail', email: 'ahmed@example.com', phone: '+20100000000' },
    { CIF: 'c2', name: 'Mona Hassan', nationalId: '29004151234568', segment: 'Priority', email: 'mona@example.com', phone: '+20110000000' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    component.customers = mockCustomers;
    component.selectedCustomerId = 'c1';
    fixture.detectChanges();
  });

  it('should create customer list component', () => {
    expect(component).toBeTruthy();
  });

  it('should render customer list items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.customer-card-item').length).toBe(2);
    expect(compiled.textContent).toContain('Ahmed Ali');
    expect(compiled.textContent).toContain('Mona Hassan');
  });

  it('should highlight selected customer item', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const selectedItem = compiled.querySelector('.customer-card-item.selected');
    expect(selectedItem).not.toBeNull();
    expect(selectedItem?.textContent).toContain('Ahmed Ali');
  });

  it('should emit customerSelect event on item click', () => {
    spyOn(component.customerSelect, 'emit');
    const compiled = fixture.nativeElement as HTMLElement;
    const secondItem = compiled.querySelectorAll('.customer-card-item')[1] as HTMLElement;

    secondItem.click();
    expect(component.customerSelect.emit).toHaveBeenCalledWith('c2');
  });
});
