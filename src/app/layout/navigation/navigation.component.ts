import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  readonly navItems: NavItem[] = [
    { label: 'Overview Dashboard', icon: 'pi pi-chart-bar', route: '/dashboard' },
    { label: 'Customer Accounts', icon: 'pi pi-wallet', route: '/accounts' },
    { label: 'Transaction History', icon: 'pi pi-list', route: '/transactions' }
  ];
}
