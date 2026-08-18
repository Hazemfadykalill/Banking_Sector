import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { BankingFacadeService } from '../../core/services/banking-facade.service';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    AvatarModule,
    TagModule,
    MenuModule,
    TranslatePipe
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  readonly facade = inject(BankingFacadeService);
  readonly themeService = inject(ThemeService);
  readonly langService = inject(LanguageService);

  get userMenuItems(): MenuItem[] {
    return [
      { label: this.langService.translate('app.profile'), icon: 'pi pi-user' },
      { label: this.langService.translate('app.settings'), icon: 'pi pi-cog' },
      { separator: true },
      { label: this.langService.translate('app.logout'), icon: 'pi pi-sign-out', command: () => this.authService.logout() }
    ];
  }
}
