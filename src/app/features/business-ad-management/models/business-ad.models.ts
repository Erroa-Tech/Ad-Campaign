export type BusinessCampaignStatus =
  | 'Live'
  | 'Pending Approval'
  | 'Approved'
  | 'Paused'
  | 'Rejected'
  | 'Draft'
  | 'Completed';

export type ActionItemType = 'alert' | 'billing' | 'calendar' | 'pending';
export type WizardStepStatus = 'active' | 'completed' | 'pending';

export interface WizardStep {
  number: number;
  label: string;
  title: string;
  subtitle: string;
}

export type CampaignPlacement = 'Status Feed Ad' | 'Full Screen Ad' | 'Call Screen Ad' | 'Banner Ad';

export interface BusinessCampaign {
  id: string;
  name: string;
  placement: string;
  status: BusinessCampaignStatus;
  reach: number | null;
  clicks: number | null;
  spend: number;
  updatedDate: string;
}

export interface CampaignTimelineEvent {
  status: string;
  date: string;
  note: string;
}

export interface MyCampaign {
  id: string;
  name: string;
  objective: string;
  placement: CampaignPlacement;
  status: BusinessCampaignStatus;
  reach: number | null;
  clicks: number | null;
  spend: number;
  totalBudget: number;
  startDate: string | null;
  endDate: string | null;
  // Detail panel fields
  category?: string;
  description?: string;
  createdDate?: string;
  gender?: string;
  ageRange?: string;
  location?: string;
  timeline?: CampaignTimelineEvent[];
}

export type TransactionType   = 'Ad Spend' | 'Top-up' | 'Plan Fee' | 'Refund';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface BillingTransaction {
  id: string;
  txnId: string;
  date: string;           // ISO date string (YYYY-MM-DD)
  campaign: string | null;
  type: TransactionType;
  amount: number;         // negative = outgoing, positive = incoming
  status: TransactionStatus;
}

export type TicketPriority = 'High' | 'Medium' | 'Low';
export type TicketStatus   = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketCategory = 'Approval Issue' | 'Payment Issue' | 'Ad Performance' | 'General' | 'Technical';

export interface TicketChatMessage {
  id: string;
  sender: 'user' | 'support';
  senderName?: string;
  timestamp: string;
  text: string;
}

export interface SupportTicket {
  id: string;
  ticketId: string;
  subject: string;
  campaignRef: string | null;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  updatedLabel: string;
  description?: string;
  openedDate?: string;
  messages?: TicketChatMessage[];
}

export interface DashboardStat {
  label: string;
  value: string;
  subtext: string;
  subtextPositive: boolean;
}

export interface ActionItem {
  id: string;
  type: ActionItemType;
  title: string;
  description: string;
  actionLabel: string;
  timeAgo: string;
}
