import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessCampaignStatus, MyCampaign } from '../../models/business-ad.models';

@Component({
  selector: 'app-campaign-detail-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-detail-drawer.component.html',
  styleUrl: './campaign-detail-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignDetailDrawerComponent {
  @Input({ required: true }) campaign!: MyCampaign;
  @Output() closed = new EventEmitter<void>();

  close(): void { this.closed.emit(); }

  get ctr(): string {
    const { reach, clicks } = this.campaign;
    if (!reach || !clicks) return '—';
    return ((clicks / reach) * 100).toFixed(2) + '%';
  }

  get budgetPercent(): number {
    if (!this.campaign.totalBudget) return 0;
    return Math.min(100, Math.round((this.campaign.spend / this.campaign.totalBudget) * 100));
  }

  get budgetRemaining(): number {
    return this.campaign.totalBudget - this.campaign.spend;
  }

  get primaryActionLabel(): string {
    switch (this.campaign.status) {
      case 'Live':   return 'Pause Campaign';
      case 'Paused': return 'Resume Campaign';
      case 'Draft':  return 'Submit for Review';
      default:       return '';
    }
  }

  get showPrimaryAction(): boolean {
    return ['Live', 'Paused', 'Draft'].includes(this.campaign.status);
  }

  statusDotClass(status: BusinessCampaignStatus): string {
    const map: Record<BusinessCampaignStatus, string> = {
      'Live':             'cdd-dot--live',
      'Pending Approval': 'cdd-dot--pending',
      'Approved':         'cdd-dot--approved',
      'Paused':           'cdd-dot--paused',
      'Rejected':         'cdd-dot--rejected',
      'Draft':            'cdd-dot--draft',
      'Completed':        'cdd-dot--completed',
    };
    return map[status] ?? '';
  }

  formatNum(n: number | null): string {
    if (n === null) return '—';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return n.toString();
  }

  formatUsd(n: number): string {
    return '$' + n.toLocaleString('en-US');
  }

  formatDate(d: string | null): string {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    return `${day}-${m}-${y}`;
  }
}
