import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-transactions-placeholder',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="transactions-foundation">
      <h2>Transactions Module Placeholder</h2>
      <p-card header="Transactions State">
        <p>Total loaded transactions in state signal: <strong>{{ facade.transactions().length }}</strong></p>
      </p-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsPlaceholderComponent {
  readonly facade = inject(BankingFacadeService);
}
