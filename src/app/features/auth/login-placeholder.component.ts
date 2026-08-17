import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-placeholder',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  template: `
    <div class="login-wrapper">
      <p-card header="Apex Banking Portal Foundation" subheader="Phase 1 Architectural Foundation Ready">
        <p>Authentication infrastructure ready. Click below for foundation testing access.</p>
        <p-button label="Authenticate as Demo Customer" icon="pi pi-lock-open" (onClick)="demoLogin()"></p-button>
      </p-card>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      padding: 2rem;
    }
  `]
})
export class LoginPlaceholderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  demoLogin(): void {
    this.authService.login({ email: 'sarah.jenkins@example.com' });
    this.router.navigate(['/dashboard']);
  }
}
