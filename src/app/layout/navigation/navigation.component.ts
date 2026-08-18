import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

export interface NavItem {
  key: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  readonly navItems: NavItem[] = [
    { key: 'nav.dashboard', icon: 'pi pi-chart-bar', route: '/dashboard' },
    { key: 'nav.accounts', icon: 'pi pi-wallet', route: '/accounts' },
    { key: 'nav.transactions', icon: 'pi pi-list', route: '/transactions' }
  ];
}
