import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { MiniStatementComponent } from './mini-statement/mini-statement.component';
import { MonthlyInsightsComponent } from './monthly-insights/monthly-insights.component';
import { formatTransactionCsv, downloadCsvFile } from '../../shared/utils/csv-exporter';

@Component({
  selector: 'app-advanced',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MessageModule,
    SkeletonModule,
    MiniStatementComponent,
    MonthlyInsightsComponent
  ],
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedComponent implements OnInit {
  readonly facade = inject(BankingFacadeService);

  ngOnInit(): void {
    this.facade.loadInitialData();
  }

  onExportCsv(): void {
    const selAcc = this.facade.selectedAccount();
    const txs = this.facade.selectedAccountTransactions();

    if (!selAcc || txs.length === 0) {
      return;
    }

    const csvStr = formatTransactionCsv(txs);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `transactions-${selAcc.accountNumber}-${dateStr}.csv`;

    downloadCsvFile(csvStr, filename);
  }
}
