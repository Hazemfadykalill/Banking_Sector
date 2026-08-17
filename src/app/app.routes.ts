import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login-placeholder.component').then(m => m.LoginPlaceholderComponent)
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard-placeholder.component').then(m => m.DashboardPlaceholderComponent)
      },
      {
        path: 'accounts',
        loadComponent: () => import('./features/accounts/accounts-placeholder.component').then(m => m.AccountsPlaceholderComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transactions-placeholder.component').then(m => m.TransactionsPlaceholderComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
