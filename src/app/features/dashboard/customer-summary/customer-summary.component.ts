import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { Customer } from '../../../core/models';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-customer-summary',
  standalone: true,
  imports: [CommonModule, AvatarModule, TagModule, DividerModule, TranslatePipe],
  templateUrl: './customer-summary.component.html',
  styleUrls: ['./customer-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerSummaryComponent {
  @Input() customer: Customer | null = null;
  @Input() accountCount = 0;
  @Input() totalBalance = 0;
}
