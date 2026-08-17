import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { Account, Transaction } from '../../../core/models';

export interface MonthAnalytics {
  monthKey: string; // YYYY-MM
  monthLabel: string;
  totalCredits: number;
  totalDebits: number;
  netCashFlow: number;
  transactionCount: number;
}

export interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
}

@Component({
  selector: 'app-monthly-insights',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    TagModule,
    ProgressBarModule,
    DividerModule
  ],
  templateUrl: './monthly-insights.component.html',
  styleUrls: ['./monthly-insights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthlyInsightsComponent {
  @Input() transactions: Transaction[] = [];
  @Input() selectedAccount: Account | null = null;

  get monthlyAnalytics(): MonthAnalytics[] {
    if (!this.transactions || this.transactions.length === 0) {
      return [];
    }

    const map = new Map<string, MonthAnalytics>();

    for (const tx of this.transactions) {
      const d = new Date(tx.date);
      if (isNaN(d.getTime())) continue;

      const year = d.getFullYear();
      const monthStr = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${monthStr}`;

      const monthName = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!map.has(key)) {
        map.set(key, {
          monthKey: key,
          monthLabel: monthName,
          totalCredits: 0,
          totalDebits: 0,
          netCashFlow: 0,
          transactionCount: 0
        });
      }

      const entry = map.get(key)!;
      entry.transactionCount++;

      if (tx.type === 'Credit') {
        entry.totalCredits = Number((entry.totalCredits + tx.amount).toFixed(2));
      } else {
        entry.totalDebits = Number((entry.totalDebits + tx.amount).toFixed(2));
      }

      entry.netCashFlow = Number((entry.totalCredits - entry.totalDebits).toFixed(2));
    }

    // Return sorted descending by monthKey (most recent month first)
    return Array.from(map.values()).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }

  get categorySpends(): CategorySpend[] {
    if (!this.transactions || this.transactions.length === 0) {
      return [];
    }

    const debitTxs = this.transactions.filter(t => t.type === 'Debit');
    const totalDebitAmount = debitTxs.reduce((sum, t) => sum + t.amount, 0);

    if (totalDebitAmount === 0) {
      return [];
    }

    const catMap = new Map<string, number>();
    for (const tx of debitTxs) {
      const current = catMap.get(tx.category) || 0;
      catMap.set(tx.category, Number((current + tx.amount).toFixed(2)));
    }

    return Array.from(catMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Number(((amount / totalDebitAmount) * 100).toFixed(1))
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  get topSpendingCategory(): CategorySpend | null {
    const spends = this.categorySpends;
    return spends.length > 0 ? spends[0] : null;
  }

  get totalCreditsAllTime(): number {
    return this.transactions
      .filter(t => t.type === 'Credit')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalDebitsAllTime(): number {
    return this.transactions
      .filter(t => t.type === 'Debit')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get netCashFlowAllTime(): number {
    return Number((this.totalCreditsAllTime - this.totalDebitsAllTime).toFixed(2));
  }
}
