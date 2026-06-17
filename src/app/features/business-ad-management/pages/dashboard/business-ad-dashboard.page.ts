import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { ActionRequiredComponent } from '../../components/action-required/action-required.component';
import {
  ActionItem,
  BusinessCampaign,
  BusinessCampaignStatus,
  DashboardStat,
} from '../../models/business-ad.models';

@Component({
  selector: 'app-business-ad-dashboard',
  standalone: true,
  imports: [CommonModule,RouterLink, StatCardComponent, ActionRequiredComponent],
  templateUrl: './business-ad-dashboard.page.html',
  styleUrl: './business-ad-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessAdDashboardPageComponent {
  readonly today = 'Thursday, June 11, 2026';

  readonly stats: DashboardStat[] = [
    { label: 'Active Campaigns', value: '7',        subtext: '+2 this week',             subtextPositive: true  },
    { label: 'Pending Review',   value: '3',        subtext: 'Avg. 2-day review',        subtextPositive: false },
    { label: 'Total Reach',      value: '284.5K',   subtext: '+18.4% vs last month',     subtextPositive: true  },
    { label: 'Total Spend',      value: '$12,840',  subtext: '$4,200 budget remaining',  subtextPositive: false },
  ];

  readonly campaigns: BusinessCampaign[] = [
    { id: '1', name: 'Summer Sale 2024',    placement: 'Status Feed Ad', status: 'Live',             reach: 45200, clicks: 2840, spend: 1280, updatedDate: 'Jun 10' },
    { id: '2', name: 'Brand Awareness Q4', placement: 'Status Feed Ad', status: 'Pending Approval', reach: null,  clicks: null, spend: 0,    updatedDate: 'Jun 9'  },
    { id: '3', name: 'New Product Launch', placement: 'Full Screen Ad', status: 'Approved',          reach: null,  clicks: null, spend: 0,    updatedDate: 'Jun 8'  },
    { id: '4', name: 'Promo Code Drive',   placement: 'Status Feed Ad', status: 'Paused',            reach: 28900, clicks: 1420, spend: 430,  updatedDate: 'Jun 5'  },
    { id: '5', name: 'Flash Sale Campaign',placement: 'Full Screen Ad', status: 'Rejected',          reach: null,  clicks: null, spend: 0,    updatedDate: 'Jun 10' },
    { id: '6', name: 'Holiday Special',    placement: 'Status Feed Ad', status: 'Draft',             reach: null,  clicks: null, spend: 0,    updatedDate: 'Jun 9'  },
  ];

  readonly actionItems: ActionItem[] = [
    {
      id: '1', type: 'alert',
      title: '"Flash Sale Campaign" rejected',
      description: 'Ad copy violates content guidelines. Revise and resubmit.',
      actionLabel: 'Resubmit',
      timeAgo: '2h ago',
    },
    {
      id: '2', type: 'billing',
      title: 'Payment card expiring in 3 days',
      description: 'Visa ending 4242 expires Jun 2024. Update to avoid interruptions.',
      actionLabel: 'Update Card',
      timeAgo: '12h ago',
    },
    {
      id: '3', type: 'calendar',
      title: '"Back to School" ends tomorrow',
      description: 'Campaign will stop on Jun 11. Extend if needed.',
      actionLabel: 'Extend',
      timeAgo: '1d ago',
    },
    {
      id: '4', type: 'pending',
      title: '"Brand Video" pending 5+ days',
      description: 'Still awaiting review. Contact support for expedited approval.',
      actionLabel: 'Contact Support',
      timeAgo: '5d ago',
    },
  ];

  statusClass(status: BusinessCampaignStatus): string {
    return 'bad-status-' + status.toLowerCase().replace(/\s+/g, '-');
  }

  fmtNumber(n: number | null): string {
    if (n === null) return '—';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toString();
  }

  fmtSpend(n: number): string {
    return n === 0 ? '$0' : '$' + n.toLocaleString();
  }
}
