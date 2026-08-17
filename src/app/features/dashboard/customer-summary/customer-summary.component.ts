import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { Customer } from '../../../core/models';

@Component({
  selector: 'app-customer-summary',
  standalone: true,
  imports: [CommonModule, CardModule, AvatarModule, TagModule, DividerModule],
  templateUrl: './customer-summary.component.html',
  styleUrls: ['./customer-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerSummaryComponent {
  @Input() customer: Customer | null = null;
  @Input() accountCount: number = 0;
  @Input() totalBalance: number = 0;
}
