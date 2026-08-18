import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { TransactionFilter, Transaction } from '../../core/models';
import { TransactionFiltersComponent } from './transaction-filters/transaction-filters.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    CardModule,
    SkeletonModule,
    MessageModule,
    TagModule,
    TransactionFiltersComponent,
    TransactionListComponent,
    CreateTransactionComponent
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsComponent implements OnInit {
  readonly facade = inject(BankingFacadeService);

  readonly activeFilter = signal<TransactionFilter>({});
  readonly isCreateModalOpen = signal<boolean>(false);

  readonly isFiltered = computed(() => {
    const filter = this.activeFilter();
    return !!(
      filter.startDate ||
      filter.endDate ||
      (filter.type && filter.type !== 'ALL') ||
      (filter.category && filter.category !== 'ALL') ||
      (filter.searchQuery && filter.searchQuery.length > 0)
    );
  });

  readonly filteredTransactions = computed(() => {
    const rawTxs = this.facade.selectedAccountTransactions();
    const filter = this.activeFilter();
    let result = [...rawTxs];

    // Filter Date Range
    if (filter.startDate) {
      const start = new Date(filter.startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter(t => new Date(t.date) >= start);
    }
    if (filter.endDate) {
      const end = new Date(filter.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(t => new Date(t.date) <= end);
    }

    // Filter Type
    if (filter.type && filter.type !== 'ALL') {
      result = result.filter(t => t.type === filter.type);
    }

    // Filter Category
    if (filter.category && filter.category !== 'ALL') {
      result = result.filter(t => t.category === filter.category);
    }

    // Filter Search
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(t =>
        t.merchant.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort
    const sortBy = filter.sortBy || 'date';
    const sortOrder = filter.sortOrder || 'desc';

    result.sort((a, b) => {
      if (sortBy === 'date') {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      } else {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
    });

    return result;
  });

  get accountOptions() {
    return this.facade.customerAccounts().map(acc => ({
      label: `${acc.iban} (${acc.type}) - ${acc.balance.toLocaleString('en-US', { style: 'currency', currency: acc.currency })}`,
      value: acc.id
    }));
  }

  ngOnInit(): void {
    this.facade.loadInitialData();
  }

  onAccountSwitch(accountId: string): void {
    this.facade.selectAccount(accountId);
  }

  onFilterChange(filter: TransactionFilter): void {
    this.activeFilter.set(filter);
  }

  onFilterReset(): void {
    this.activeFilter.set({});
  }

  openCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  onTransactionCreated(newTx: Transaction): void {
    // Keep current account context intact and close modal
    this.closeCreateModal();
  }
}
