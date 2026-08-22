import { Component, Output, EventEmitter, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TransactionCategory, TransactionType, TransactionFilter, TransactionTypeKind } from '../../../core/models';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

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
    CardModule,
    TranslatePipe
  ],
  templateUrl: './transaction-filters.component.html',
  styleUrls: ['./transaction-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionFiltersComponent {
  private readonly langService = inject(LanguageService);

  readonly categories = input<TransactionCategory[]>([]);
  readonly types = input<TransactionType[]>([]);
  @Output() filterChange = new EventEmitter<TransactionFilter>();
  @Output() filterReset = new EventEmitter<void>();

  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedType = 'ALL';
  selectedCategory = 'ALL';
  searchQuery = '';
  sortBy: 'date' | 'amount' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';
  selectedSortKey = 'date-desc';

  readonly typeOptions = computed(() => [
    { label: this.langService.translate('filters.allTypes'), value: 'ALL' },
    { label: this.langService.translate('type.Debit'), value: 'Debit' },
    { label: this.langService.translate('type.Credit'), value: 'Credit' }
  ]);

  readonly categoryOptions = computed(() => {
    return [
      { label: this.langService.translate('filters.allCategories'), value: 'ALL' },
      ...this.categories().map(c => ({
        label: this.langService.translate(`cat.${c.name}`),
        value: c.name
      }))
    ];
  });

  onFilterUpdate(): void {
    const filter: TransactionFilter = {
      startDate: this.startDate,
      endDate: this.endDate,
      type: this.selectedType as TransactionTypeKind | 'ALL',
      category: this.selectedCategory,
      searchQuery: this.searchQuery.trim(),
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };
    this.filterChange.emit(filter);
  }

  onSortChange(event: { value: string }): void {
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
