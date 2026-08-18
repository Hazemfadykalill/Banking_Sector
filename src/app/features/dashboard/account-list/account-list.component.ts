import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Account } from '../../../core/models';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, CardModule, ButtonModule],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountListComponent {
  @Input({ required: true }) accounts: Account[] = [];
  @Input() selectedAccountId: string | null = null;
  @Output() accountSelect = new EventEmitter<string>();

  selectAccount(id: string): void {
    this.accountSelect.emit(id);
  }

  getTypeSeverity(type: string): 'success' | 'info' | 'warn' | 'secondary' {
    switch (type.toLowerCase()) {
      case 'current':
      case 'checking': return 'info';
      case 'savings': return 'success';
      case 'investment': return 'warn';
      default: return 'secondary';
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'dormant': return 'warn';
      case 'frozen': return 'danger';
      default: return 'info';
    }
  }
}
