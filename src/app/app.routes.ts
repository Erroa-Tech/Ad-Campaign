import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/business-ad-management/business-ad-management.routes').then(
        m => m.BUSINESS_AD_MANAGEMENT_ROUTES
      ),
  },
  { path: '**', redirectTo: 'auth/login' },
];
