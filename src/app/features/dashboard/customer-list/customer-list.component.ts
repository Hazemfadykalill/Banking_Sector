import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { Customer } from '../../../core/models';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, CardModule, AvatarModule, TagModule, TranslatePipe],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerListComponent {
  @Input({ required: true }) customers: Customer[] = [];
  @Input() selectedCustomerId: string | null = null;
  @Output() customerSelect = new EventEmitter<string>();

  selectCustomer(id: string): void {
    this.customerSelect.emit(id);
  }

  onKeyDown(event: KeyboardEvent, id: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectCustomer(id);
    }
  }

  getSegmentSeverity(segment?: string): 'success' | 'info' | 'warn' | 'secondary' {
    switch (segment?.toLowerCase()) {
      case 'priority': return 'warn';
      case 'business': return 'success';
      case 'retail': return 'info';
      default: return 'secondary';
    }
  }
}
