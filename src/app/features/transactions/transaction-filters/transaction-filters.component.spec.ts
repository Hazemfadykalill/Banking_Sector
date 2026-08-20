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

  it('should compute typeOptions and categoryOptions correctly', () => {
    const types = component.typeOptions();
    expect(types.length).toBe(3);
    expect(types.map(t => t.value)).toEqual(['ALL', 'Debit', 'Credit']);

    const categories = component.categoryOptions();
    expect(categories.length).toBe(3);
    expect(categories.map(c => c.value)).toEqual(['ALL', 'Groceries', 'Bills']);
  });

  it('should emit filterChange event on filter update', () => {
    spyOn(component.filterChange, 'emit');
    component.selectedType = 'Debit';
    component.selectedCategory = 'Groceries';
    component.searchQuery = '  Supermarket  ';
    component.onFilterUpdate();

    expect(component.filterChange.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      type: 'Debit',
      category: 'Groceries',
      searchQuery: 'Supermarket'
    }));
  });

  it('should handle date range filters correctly', () => {
    spyOn(component.filterChange, 'emit');
    const start = new Date('2026-01-01');
    const end = new Date('2026-01-31');

    component.startDate = start;
    component.endDate = end;
    component.onFilterUpdate();

    expect(component.filterChange.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      startDate: start,
      endDate: end
    }));
  });

  it('should update sortBy and sortOrder correctly on sort change', () => {
    spyOn(component.filterChange, 'emit');

    component.onSortChange({ value: 'date-asc' });
    expect(component.sortBy).toBe('date');
    expect(component.sortOrder).toBe('asc');
    expect(component.filterChange.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      sortBy: 'date',
      sortOrder: 'asc'
    }));

    component.onSortChange({ value: 'amount-desc' });
    expect(component.sortBy).toBe('amount');
    expect(component.sortOrder).toBe('desc');
    expect(component.filterChange.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      sortBy: 'amount',
      sortOrder: 'desc'
    }));

    component.onSortChange({ value: 'amount-asc' });
    expect(component.sortBy).toBe('amount');
    expect(component.sortOrder).toBe('asc');

    component.onSortChange({ value: 'date-desc' });
    expect(component.sortBy).toBe('date');
    expect(component.sortOrder).toBe('desc');
  });

  it('should reset all filters and emit filterReset event', () => {
    spyOn(component.filterReset, 'emit');
    component.selectedType = 'Credit';
    component.searchQuery = 'Supermarket';
    component.startDate = new Date();
    component.endDate = new Date();
    component.sortBy = 'amount';
    component.sortOrder = 'asc';

    component.resetFilters();

    expect(component.selectedType).toBe('ALL');
    expect(component.selectedCategory).toBe('ALL');
    expect(component.searchQuery).toBe('');
    expect(component.startDate).toBeNull();
    expect(component.endDate).toBeNull();
    expect(component.sortBy).toBe('date');
    expect(component.sortOrder).toBe('desc');
    expect(component.selectedSortKey).toBe('date-desc');
    expect(component.filterReset.emit).toHaveBeenCalled();
  });
});
