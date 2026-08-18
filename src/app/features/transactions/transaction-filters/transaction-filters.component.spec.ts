import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TransactionFiltersComponent } from './transaction-filters.component';
import { TransactionCategory, TransactionType } from '../../../core/models';

describe('TransactionFiltersComponent', () => {
  let component: TransactionFiltersComponent;
  let fixture: ComponentFixture<TransactionFiltersComponent>;

  const mockCategories: TransactionCategory[] = [
    { id: 'cat1', name: 'Groceries' },
    { id: 'cat2', name: 'Bills' }
  ];

  const mockTypes: TransactionType[] = [
    { id: 't1', name: 'Debit' },
    { id: 't2', name: 'Credit' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionFiltersComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFiltersComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', mockCategories);
    fixture.componentRef.setInput('types', mockTypes);
    fixture.detectChanges();
  });

  it('should create transaction filters component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChange event on filter update', () => {
    spyOn(component.filterChange, 'emit');
    component.selectedType = 'Debit';
    component.onFilterUpdate();

    expect(component.filterChange.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      type: 'Debit'
    }));
  });

  it('should reset all filters and emit filterReset event', () => {
    spyOn(component.filterReset, 'emit');
    component.selectedType = 'Credit';
    component.searchQuery = 'Supermarket';
    component.resetFilters();

    expect(component.selectedType).toBe('ALL');
    expect(component.searchQuery).toBe('');
    expect(component.filterReset.emit).toHaveBeenCalled();
  });
});
