import { Component, inject, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { AuthService } from '../../core/services/auth.service';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerSummaryComponent } from './customer-summary/customer-summary.component';
import { AccountListComponent } from './account-list/account-list.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    SkeletonModule,
    MessageModule,
    ButtonModule,
    CustomerListComponent,
    CustomerSummaryComponent,
    AccountListComponent,
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  readonly facade = inject(BankingFacadeService);
  readonly authService = inject(AuthService);

  readonly totalPortfolioBalance = computed(() => {
    return this.facade.customerAccounts().reduce((sum, acc) => sum + acc.balance, 0);
  });

  readonly systemTotalLiquidity = computed(() => {
    return this.facade.accounts().reduce((sum, acc) => sum + acc.balance, 0);
  });

  ngOnInit(): void {
    this.facade.loadInitialData();
  }

  onCustomerSelect(id: string): void {
    this.facade.selectCustomer(id);
  }

  onAccountSelect(id: string): void {
    this.facade.selectAccount(id);
  }

  onRetry(): void {
    this.facade.loadInitialData();
  }
}
