import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SupportTicket,
  TicketPriority,
  TicketStatus,
} from '../../models/business-ad.models';
import { CreateTicketModalComponent } from './create-ticket-modal.component';
import { TicketChatDrawerComponent } from './ticket-chat-drawer.component';

type TicketTab = 'all' | 'open' | 'in-progress' | 'resolved' | 'closed';

interface TicketTabConfig {
  id: TicketTab;
  label: string;
  statuses: TicketStatus[];
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateTicketModalComponent, TicketChatDrawerComponent],
  templateUrl: './support.page.html',
  styleUrl: './support.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportPageComponent {

  readonly tickets: SupportTicket[] = [
    {
      id: '1',
      ticketId: 'TKT-1042',
      subject: '"Flash Sale Campaign" rejection appeal',
      campaignRef: 'Flash Sale Campaign',
      category: 'Approval Issue',
      priority: 'High',
      status: 'Open',
      updatedLabel: 'Jun 10, 2026',
      openedDate: 'Jun 10, 2026',
      description: 'My campaign was rejected for ad copy valence but I believe the content meet guidliens. Requesting review.',
      messages: [
        {
          id: 'm1',
          sender: 'user',
          timestamp: 'Jun 10 · 10:23 AM',
          text: 'Hi, my "Flash Sale Campaign" was rejected citing unverifiable superlative claims. I have revised the copy to remove "best deal ever" and replaced it with "up to 60% off". Could you re-review the campaign?',
        },
        {
          id: 'm2',
          sender: 'support',
          senderName: 'Sarah K.',
          timestamp: 'Jun 10 · 11:05 AM',
          text: 'Thank you for reaching out. I can see your campaign TKT-1042. Our team will review the revised creative within 24 hours. You will receive a notification once the review is complete.',
        },
      ],
    },
    {
      id: '2',
      ticketId: 'TKT-1038',
      subject: 'Payment card update returning validation error',
      campaignRef: null,
      category: 'Payment Issue',
      priority: 'High',
      status: 'In Progress',
      updatedLabel: '1 day ago',
      openedDate: 'Jun 11, 2026',
      description: 'When I try to update my payment card details, the form returns a validation error after submission even though all fields appear correct.',
      messages: [
        {
          id: 'm1',
          sender: 'user',
          timestamp: 'Jun 11 · 9:14 AM',
          text: 'I keep getting a "card validation failed" error when updating my Visa ending in 4242. I have tried two different cards and the same error appears.',
        },
        {
          id: 'm2',
          sender: 'support',
          senderName: 'David R.',
          timestamp: 'Jun 11 · 10:30 AM',
          text: 'We are aware of an issue affecting card updates for some accounts. Our engineering team is actively working on a fix. We will notify you as soon as it is resolved.',
        },
      ],
    },
    {
      id: '3',
      ticketId: 'TKT-1031',
      subject: '"Brand Awareness Q4" reach lower than expected',
      campaignRef: 'Brand Awareness Q4',
      category: 'Ad Performance',
      priority: 'Medium',
      status: 'In Progress',
      updatedLabel: '3 days ago',
      openedDate: 'Jun 9, 2026',
      description: 'The Brand Awareness Q4 campaign is showing significantly lower reach than our estimated projections. Expected 50k impressions but only receiving around 12k.',
      messages: [
        {
          id: 'm1',
          sender: 'user',
          timestamp: 'Jun 9 · 2:45 PM',
          text: 'Our Brand Awareness Q4 campaign has been running for 5 days and reach is at 12,400 — far below the 50,000 estimate. Is there a targeting issue or budget pacing problem?',
        },
      ],
    },
    {
      id: '4',
      ticketId: 'TKT-1018',
      subject: 'Invoice INV-2405 amount discrepancy',
      campaignRef: null,
      category: 'Payment Issue',
      priority: 'Medium',
      status: 'Resolved',
      updatedLabel: 'May 20, 2026',
      openedDate: 'May 18, 2026',
      description: 'Invoice INV-2405 shows a charge of $1,200 but based on our campaign spend the expected amount should be $980. Please clarify the discrepancy.',
      messages: [
        {
          id: 'm1',
          sender: 'user',
          timestamp: 'May 18 · 11:00 AM',
          text: 'Invoice INV-2405 charges $1,200 but our dashboard shows total spend of $980 for that period. Can you explain the $220 difference?',
        },
        {
          id: 'm2',
          sender: 'support',
          senderName: 'Sarah K.',
          timestamp: 'May 19 · 3:22 PM',
          text: 'The $220 difference is the monthly platform fee charged at the start of each billing cycle. It is listed separately from ad spend on your invoice. I have added a clearer breakdown to your account.',
        },
        {
          id: 'm3',
          sender: 'user',
          timestamp: 'May 20 · 9:05 AM',
          text: 'That makes sense, thank you for clarifying!',
        },
      ],
    },
    {
      id: '5',
      ticketId: 'TKT-1009',
      subject: 'How to set up city-level geo-targeting?',
      campaignRef: null,
      category: 'General',
      priority: 'Low',
      status: 'Resolved',
      updatedLabel: 'May 6, 2026',
      openedDate: 'May 5, 2026',
      description: 'I want to target users in specific cities rather than a whole country. I cannot find the city-level targeting option in the campaign setup wizard.',
      messages: [
        {
          id: 'm1',
          sender: 'user',
          timestamp: 'May 5 · 4:10 PM',
          text: 'I can only see country and region targeting. Is city-level geo-targeting available and if so, where is it in the campaign wizard?',
        },
        {
          id: 'm2',
          sender: 'support',
          senderName: 'James T.',
          timestamp: 'May 6 · 10:00 AM',
          text: 'City-level targeting is available under Audience Targeting → Location → select "City" from the dropdown. You can add multiple cities. Let us know if you need any further help!',
        },
      ],
    },
  ];

  readonly tabs: TicketTabConfig[] = [
    { id: 'all',         label: 'All',         statuses: ['Open', 'In Progress', 'Resolved', 'Closed'] },
    { id: 'open',        label: 'Open',        statuses: ['Open'] },
    { id: 'in-progress', label: 'In Progress', statuses: ['In Progress'] },
    { id: 'resolved',    label: 'Resolved',    statuses: ['Resolved'] },
    { id: 'closed',      label: 'Closed',      statuses: ['Closed'] },
  ];

  activeTab: TicketTab = 'all';
  searchQuery = '';
  showModal = false;
  selectedTicket: SupportTicket | null = null;

  get activeCount(): number {
    return this.tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  }

  tabCount(tab: TicketTabConfig): number {
    return this.tickets.filter(t => tab.statuses.includes(t.status)).length;
  }

  get filteredTickets(): SupportTicket[] {
    const tab = this.tabs.find(t => t.id === this.activeTab)!;
    const q   = this.searchQuery.toLowerCase();
    return this.tickets.filter(t => {
      const matchesTab    = tab.statuses.includes(t.status);
      const matchesSearch = !q ||
        t.ticketId.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        (t.campaignRef?.toLowerCase().includes(q) ?? false);
      return matchesTab && matchesSearch;
    });
  }

  setTab(id: TicketTab): void { this.activeTab = id; }

  openModal(): void  { this.showModal = true; }
  closeModal(): void { this.showModal = false; }

  openChat(ticket: SupportTicket): void  { this.selectedTicket = ticket; }
  closeChat(): void                       { this.selectedTicket = null; }

  priorityClass(priority: TicketPriority): string {
    const map: Record<TicketPriority, string> = {
      'High':   'sp-priority--high',
      'Medium': 'sp-priority--medium',
      'Low':    'sp-priority--low',
    };
    return map[priority];
  }

  statusClass(status: TicketStatus): string {
    const map: Record<TicketStatus, string> = {
      'Open':        'sp-status--open',
      'In Progress': 'sp-status--in-progress',
      'Resolved':    'sp-status--resolved',
      'Closed':      'sp-status--closed',
    };
    return map[status];
  }
}
