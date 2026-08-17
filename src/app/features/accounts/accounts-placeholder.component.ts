import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-accounts-placeholder',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="accounts-foundation">
      <h2>Accounts Module Placeholder</h2>
      <p-card header="Loaded Accounts Count">
        <p>Total active accounts in state signal: <strong>{{ facade.accounts().length }}</strong></p>
      </p-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsPlaceholderComponent {
  readonly facade = inject(BankingFacadeService);
}
