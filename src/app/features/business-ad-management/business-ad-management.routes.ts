import { Routes } from '@angular/router';
import { BusinessAdLayoutComponent } from './layout/business-ad-layout.component';
import { BusinessAdDashboardPageComponent } from './pages/dashboard/business-ad-dashboard.page';
import { CreateCampaignPageComponent } from './pages/create-campaign/create-campaign.page';
import { MyCampaignsPageComponent } from './pages/my-campaigns/my-campaigns.page';
import { BillingPageComponent } from './pages/billing/billing.page';
import { SupportPageComponent } from './pages/support/support.page';
import { OnboardingPageComponent } from './pages/onboarding/onboarding.page';

export const BUSINESS_AD_MANAGEMENT_ROUTES: Routes = [
  {
    path: 'onboarding',
    component: OnboardingPageComponent,
  },
  {
    path: '',
    component: BusinessAdLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: BusinessAdDashboardPageComponent,
      },
      {
        path: 'create-campaign',
        component: CreateCampaignPageComponent,
      },
      {
        path: 'my-campaigns',
        component: MyCampaignsPageComponent,
      },
      {
        path: 'billing',
        component: BillingPageComponent,
      },
      {
        path: 'support',
        component: SupportPageComponent,
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
