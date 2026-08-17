import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TransactionCategory, TransactionType, TransactionFilter } from '../../../core/models';

@Component({
  selector: 'app-transaction-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    DatePickerModule,
    InputTextModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './transaction-filters.component.html',
  styleUrls: ['./transaction-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionFiltersComponent implements OnInit {
  @Input() categories: TransactionCategory[] = [];
  @Input() types: TransactionType[] = [];
  @Output() filterChange = new EventEmitter<TransactionFilter>();
  @Output() filterReset = new EventEmitter<void>();

  // Filter model state
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedType: string = 'ALL';
  selectedCategory: string = 'ALL';
  searchQuery: string = '';
  sortBy: 'date' | 'amount' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  typeOptions = [
    { label: 'All Types', value: 'ALL' },
    { label: 'Debit', value: 'Debit' },
    { label: 'Credit', value: 'Credit' }
  ];

  sortOptions = [
    { label: 'Date (Newest First)', sortBy: 'date', sortOrder: 'desc' },
    { label: 'Date (Oldest First)', sortBy: 'date', sortOrder: 'asc' },
    { label: 'Amount (Highest First)', sortBy: 'amount', sortOrder: 'desc' },
    { label: 'Amount (Lowest First)', sortBy: 'amount', sortOrder: 'asc' }
  ];

  selectedSortKey: string = 'date-desc';

  ngOnInit(): void {
    // Component initialized with defaults
  }

  get categoryOptions() {
    return [
      { label: 'All Categories', value: 'ALL' },
      ...this.categories.map(c => ({ label: c.name, value: c.name }))
    ];
  }

  onFilterUpdate(): void {
    const filter: TransactionFilter = {
      startDate: this.startDate,
      endDate: this.endDate,
      type: this.selectedType as any,
      category: this.selectedCategory,
      searchQuery: this.searchQuery.trim(),
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };
    this.filterChange.emit(filter);
  }

  onSortChange(event: any): void {
    const val = event.value;
    if (val === 'date-desc') {
      this.sortBy = 'date';
      this.sortOrder = 'desc';
    } else if (val === 'date-asc') {
      this.sortBy = 'date';
      this.sortOrder = 'asc';
    } else if (val === 'amount-desc') {
      this.sortBy = 'amount';
      this.sortOrder = 'desc';
    } else if (val === 'amount-asc') {
      this.sortBy = 'amount';
      this.sortOrder = 'asc';
    }
    this.onFilterUpdate();
  }

  resetFilters(): void {
    this.startDate = null;
    this.endDate = null;
    this.selectedType = 'ALL';
    this.selectedCategory = 'ALL';
    this.searchQuery = '';
    this.sortBy = 'date';
    this.sortOrder = 'desc';
    this.selectedSortKey = 'date-desc';
    this.filterReset.emit();
  }
}
