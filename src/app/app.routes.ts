import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/business-ad-management/business-ad-management.routes').then(
        m => m.BUSINESS_AD_MANAGEMENT_ROUTES
      ),
  },
  { path: '**', redirectTo: '' },
];
