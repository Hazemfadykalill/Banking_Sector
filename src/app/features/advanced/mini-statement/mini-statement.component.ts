import { Component, Input, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Account, Transaction } from '../../../core/models';

@Component({
  selector: 'app-mini-statement',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ButtonModule],
  templateUrl: './mini-statement.component.html',
  styleUrls: ['./mini-statement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniStatementComponent {
  @Input() transactions: Transaction[] = [];
  @Input() selectedAccount: Account | null = null;
  @Input() limit: number = 5;

  get recentTransactions(): Transaction[] {
    return (this.transactions || []).slice(0, this.limit);
  }
}
