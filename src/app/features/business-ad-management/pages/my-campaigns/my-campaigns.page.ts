import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessCampaignStatus, MyCampaign } from '../../models/business-ad.models';
import { CampaignDetailDrawerComponent } from './campaign-detail-drawer.component';

type CampaignTab = 'all' | 'live' | 'pending' | 'paused' | 'draft' | 'rejected' | 'completed';

interface TabConfig {
  id: CampaignTab;
  label: string;
  statuses: BusinessCampaignStatus[];
}

@Component({
  selector: 'app-my-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, CampaignDetailDrawerComponent],
  templateUrl: './my-campaigns.page.html',
  styleUrl: './my-campaigns.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCampaignsPageComponent {

  readonly campaigns: MyCampaign[] = [
    {
      id: '1', name: 'Summer Sale 2024', objective: 'Conversions',
      placement: 'Status Feed Ad', status: 'Live',
      reach: 45200, clicks: 2800, spend: 1280, totalBudget: 2400,
      startDate: '2026-05-12', endDate: '2026-05-16',
      category: 'Retail',
      description: 'Promote our summer clearance sale with 40% off on all electronics.',
      createdDate: 'May 28, 2024', gender: 'All', ageRange: '18–34', location: 'India',
      timeline: [
        { status: 'Live',             date: 'Jun 1, 2026',  note: 'Campaign started' },
        { status: 'Approved',         date: 'May 31, 2026', note: 'Content meets all guidelines' },
        { status: 'Pending Approval', date: 'May 29, 2026', note: '' },
        { status: 'Draft',            date: 'May 28, 2026', note: 'Created' },
      ],
    },
    {
      id: '2', name: 'Brand Awareness Q4', objective: 'Brand Awareness',
      placement: 'Status Feed Ad', status: 'Pending Approval',
      reach: null, clicks: null, spend: 0, totalBudget: 1200,
      startDate: '2026-05-12', endDate: '2026-05-16',
      category: 'Brand',
      description: 'Build brand recognition among key demographics in Q4 2026.',
      createdDate: 'May 10, 2026', gender: 'All', ageRange: '25–44', location: 'United States',
      timeline: [
        { status: 'Pending Approval', date: 'May 12, 2026', note: 'Awaiting review' },
        { status: 'Draft',            date: 'May 10, 2026', note: 'Created' },
      ],
    },
    {
      id: '3', name: 'New Product Launch', objective: 'Reach',
      placement: 'Full Screen Ad', status: 'Approved',
      reach: null, clicks: null, spend: 0, totalBudget: 3500,
      startDate: '2026-05-12', endDate: '2026-05-10',
      category: 'Product Launch',
      description: 'Announce our new product line to potential customers worldwide.',
      createdDate: 'May 8, 2026', gender: 'All', ageRange: '18–45', location: 'Worldwide',
      timeline: [
        { status: 'Approved',         date: 'May 12, 2026', note: 'Content approved' },
        { status: 'Pending Approval', date: 'May 10, 2026', note: '' },
        { status: 'Draft',            date: 'May 8, 2026',  note: 'Created' },
      ],
    },
    {
      id: '4', name: 'Promo Code Drive', objective: 'Conversions',
      placement: 'Status Feed Ad', status: 'Paused',
      reach: 28900, clicks: 1400, spend: 430, totalBudget: 890,
      startDate: '2026-05-12', endDate: '2026-05-12',
      category: 'Promotions',
      description: 'Drive conversions with exclusive promo codes for first-time buyers.',
      createdDate: 'May 5, 2026', gender: 'All', ageRange: '18–35', location: 'India',
      timeline: [
        { status: 'Paused',           date: 'May 15, 2026', note: 'Budget limit reached' },
        { status: 'Live',             date: 'May 12, 2026', note: 'Campaign started' },
        { status: 'Approved',         date: 'May 8, 2026',  note: '' },
        { status: 'Draft',            date: 'May 5, 2026',  note: 'Created' },
      ],
    },
    {
      id: '5', name: 'Flash Sale Campaign', objective: 'Traffic',
      placement: 'Full Screen Ad', status: 'Rejected',
      reach: null, clicks: null, spend: 0, totalBudget: 500,
      startDate: '2026-05-12', endDate: '2026-05-12',
      category: 'Sales',
      description: 'Limited-time flash sale on selected products.',
      createdDate: 'May 8, 2026', gender: 'All', ageRange: '18–40', location: 'United Kingdom',
      timeline: [
        { status: 'Rejected',         date: 'May 12, 2026', note: 'Content does not meet guidelines' },
        { status: 'Pending Approval', date: 'May 10, 2026', note: '' },
        { status: 'Draft',            date: 'May 8, 2026',  note: 'Created' },
      ],
    },
    {
      id: '6', name: 'Holiday Special', objective: 'Engagement',
      placement: 'Status Feed Ad', status: 'Draft',
      reach: null, clicks: null, spend: 0, totalBudget: 800,
      startDate: null, endDate: null,
      category: 'Seasonal',
      description: 'Holiday season promotional campaign targeting gift buyers.',
      createdDate: 'May 10, 2026', gender: 'All', ageRange: '25–55', location: 'Canada',
      timeline: [
        { status: 'Draft', date: 'May 10, 2026', note: 'Created' },
      ],
    },
    {
      id: '7', name: 'App Install Drive', objective: 'App Installs',
      placement: 'Full Screen Ad', status: 'Completed',
      reach: 112400, clicks: 8700, spend: 4200, totalBudget: 4200,
      startDate: '2024-04-01', endDate: '2024-05-01',
      category: 'App Growth',
      description: 'Drive app installations among target users with incentivized campaigns.',
      createdDate: 'Mar 25, 2024', gender: 'Male', ageRange: '18–34', location: 'Australia',
      timeline: [
        { status: 'Completed', date: 'May 1, 2024',  note: 'Campaign ended successfully' },
        { status: 'Live',      date: 'Apr 1, 2024',  note: 'Campaign started' },
        { status: 'Approved',  date: 'Mar 28, 2024', note: '' },
        { status: 'Draft',     date: 'Mar 25, 2024', note: 'Created' },
      ],
    },
  ];

  readonly tabs: TabConfig[] = [
    { id: 'all',       label: 'All',       statuses: ['Live', 'Pending Approval', 'Approved', 'Paused', 'Draft', 'Rejected', 'Completed'] },
    { id: 'live',      label: 'Live',      statuses: ['Live'] },
    { id: 'pending',   label: 'Pending',   statuses: ['Pending Approval'] },
    { id: 'paused',    label: 'Paused',    statuses: ['Paused'] },
    { id: 'draft',     label: 'Draft',     statuses: ['Draft'] },
    { id: 'rejected',  label: 'Rejected',  statuses: ['Rejected'] },
    { id: 'completed', label: 'Completed', statuses: ['Completed'] },
  ];

  readonly placements: string[] = [
    'All Placements', 'Status Feed Ad', 'Full Screen Ad', 'Call Screen Ad', 'Banner Ad',
  ];

  activeTab: CampaignTab = 'all';
  selectedPlacement = 'All Placements';
  searchQuery = '';
  currentPage = 1;
  readonly pageSize = 10;
  showPlacementDropdown = false;
  selectedCampaign: MyCampaign | null = null;

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.showPlacementDropdown = false;
      this.cdr.markForCheck();
    }
  }

  tabCount(tab: TabConfig): number {
    return this.campaigns.filter(c => tab.statuses.includes(c.status)).length;
  }

  get liveCount(): number {
    return this.campaigns.filter(c => c.status === 'Live').length;
  }

  get filteredCampaigns(): MyCampaign[] {
    const tab = this.tabs.find(t => t.id === this.activeTab)!;
    const query = this.searchQuery.toLowerCase();
    return this.campaigns.filter(c => {
      const matchesTab       = tab.statuses.includes(c.status);
      const matchesPlacement = this.selectedPlacement === 'All Placements' || c.placement === this.selectedPlacement;
      const matchesSearch    = !query || c.name.toLowerCase().includes(query);
      return matchesTab && matchesPlacement && matchesSearch;
    });
  }

  get paginatedCampaigns(): MyCampaign[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCampaigns.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCampaigns.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setTab(id: CampaignTab): void {
    this.activeTab = id;
    this.currentPage = 1;
  }

  setPlacement(p: string): void {
    this.selectedPlacement = p;
    this.showPlacementDropdown = false;
    this.currentPage = 1;
  }

  setPage(p: number): void {
    if (p >= 1 && p <= this.totalPages) this.currentPage = p;
  }

  openDrawer(campaign: MyCampaign): void {
    this.selectedCampaign = campaign;
  }

  closeDrawer(): void {
    this.selectedCampaign = null;
  }

  statusClass(status: BusinessCampaignStatus): string {
    const map: Record<BusinessCampaignStatus, string> = {
      'Live':             'mc-status--live',
      'Pending Approval': 'mc-status--pending',
      'Approved':         'mc-status--approved',
      'Paused':           'mc-status--paused',
      'Rejected':         'mc-status--rejected',
      'Draft':            'mc-status--draft',
      'Completed':        'mc-status--completed',
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
