import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { Transaction } from '../../../core/models';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, CardModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent {
  @Input({ required: true }) transactions: Transaction[] = [];
  @Input() isFiltered: boolean = false;

  getTypeSeverity(type: string): 'success' | 'warn' | 'info' {
    return type === 'Credit' ? 'success' : 'warn';
  }

  getCategorySeverity(category: string): 'info' | 'secondary' | 'warn' | 'success' {
    switch (category.toLowerCase()) {
      case 'income': return 'success';
      case 'groceries': return 'info';
      case 'bills': return 'warn';
      default: return 'secondary';
    }
  }
}
