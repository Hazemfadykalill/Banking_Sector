import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CustomerListComponent } from './customer-list.component';
import { Customer } from '../../../core/models';

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;

  const mockCustomers: Customer[] = [
    { id: 'c1', name: 'Sarah Jenkins', email: 'sarah@example.com', tier: 'Premium VIP' },
    { id: 'c2', name: 'Marcus Vance', email: 'marcus@example.com', tier: 'Platinum' }
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
    expect(compiled.textContent).toContain('Sarah Jenkins');
    expect(compiled.textContent).toContain('Marcus Vance');
  });

  it('should highlight selected customer item', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const selectedItem = compiled.querySelector('.customer-card-item.selected');
    expect(selectedItem).not.toBeNull();
    expect(selectedItem?.textContent).toContain('Sarah Jenkins');
  });

  it('should emit customerSelect event on item click', () => {
    spyOn(component.customerSelect, 'emit');
    const compiled = fixture.nativeElement as HTMLElement;
    const secondItem = compiled.querySelectorAll('.customer-card-item')[1] as HTMLElement;

    secondItem.click();
    expect(component.customerSelect.emit).toHaveBeenCalledWith('c2');
  });
});
