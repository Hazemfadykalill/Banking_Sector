import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { BankingFacadeService } from '../../core/services/banking-facade.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    AvatarModule,
    TagModule,
    MenuModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  readonly facade = inject(BankingFacadeService);

  readonly isDarkMode = signal<boolean>(false);

  readonly userMenuItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user' },
    { label: 'Settings', icon: 'pi pi-cog' },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.authService.logout() }
  ];

  toggleDarkMode(): void {
    this.isDarkMode.update(v => !v);
    const element = document.querySelector('html');
    if (element) {
      element.classList.toggle('app-dark');
    }
  }
}
