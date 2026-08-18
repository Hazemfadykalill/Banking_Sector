import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { Account, Transaction } from '../../../core/models';

@Component({
  selector: 'app-mini-statement',
  standalone: true,
  imports: [CommonModule, TagModule],
  templateUrl: './mini-statement.component.html',
  styleUrls: ['./mini-statement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniStatementComponent {
  readonly transactions = input<Transaction[]>([]);
  readonly selectedAccount = input<Account | null>(null);
  readonly limit = input<number>(5);

  readonly recentTransactions = computed<Transaction[]>(() => {
    return (this.transactions() || []).slice(0, this.limit());
  });
}
