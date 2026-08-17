import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dashboard-placeholder',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule],
  template: `
    <div class="dashboard-foundation">
      <div class="header-banner">
        <h2>Banking System Architecture Foundation</h2>
        <p-tag value="Phase 1 Ready" severity="success"></p-tag>
      </div>

      <div class="grid-container">
        <p-card header="Data Access Layer">
          <p>Cached static JSON repositories initialized: Customers, Accounts, Transactions, Types, Categories.</p>
          <strong>Total Loaded Customers: {{ facade.customers().length }}</strong>
        </p-card>

        <p-card header="State Management">
          <p>Angular Signals store initialized with zero prop-drilling or external library overhead.</p>
          <strong>Active Customer: {{ facade.selectedCustomer()?.name || 'None' }}</strong>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-foundation {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem 0;
    }
    .header-banner {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPlaceholderComponent {
  readonly facade = inject(BankingFacadeService);
}
