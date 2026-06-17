import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionDetailDrawerComponent } from './transaction-detail-drawer.component';

export type TxnType   = 'Ad Spend' | 'Top-up' | 'Platform Fee' | 'Refund';
export type TxnStatus = 'Completed' | 'Processing' | 'Pending' | 'Failed';
type SortField        = 'txnId' | 'date' | 'amount';
type SortDir          = 'asc' | 'desc';
type DateFilter       = 'all' | '30d' | '7d';

export interface TxnRow {
  id:            string;
  txnId:         string;
  date:          string;
  campaign:      string | null;
  type:          TxnType;
  amount:        number;
  tax:           number | null;
  paymentMethod: string;
  status:        TxnStatus;
  // Detail view fields
  campaignId?:   string;
  description?:  string;
  reference?:    string;
  invoice?:      string;
}

@Component({
  selector: 'app-billing-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, TransactionDetailDrawerComponent],
  templateUrl: './billing-transactions.component.html',
  styleUrl: './billing-transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingTransactionsComponent {

  readonly pageSize = 10;
  currentPage = 1;

  searchQuery = '';
  dateFilter: DateFilter      = 'all';
  typeFilter: TxnType | 'all' = 'all';

  sortField: SortField = 'date';
  sortDir:   SortDir   = 'desc';

  showDateDrop = false;
  showTypeDrop = false;

  selectedTransaction: TxnRow | null = null;

  readonly dateOptions = [
    { value: 'all', label: 'All time'     },
    { value: '30d', label: 'Last 30 days' },
    { value: '7d',  label: 'Last 7 days'  },
  ];

  readonly typeOptions: { value: TxnType | 'all'; label: string }[] = [
    { value: 'all',          label: 'All'          },
    { value: 'Ad Spend',     label: 'Ad Spend'     },
    { value: 'Top-up',       label: 'Top-up'       },
    { value: 'Platform Fee', label: 'Platform Fee' },
    { value: 'Refund',       label: 'Refund'       },
  ];

  readonly rows: TxnRow[] = [
    { id: '1',  txnId: 'TXN-8821', date: '2024-06-09', campaign: 'Summer Sale 2024',    type: 'Ad Spend',     amount: -320,  tax: 57.60,  paymentMethod: 'Visa ----4242',       status: 'Completed',  campaignId: 'CAMP-0091', description: 'Daily campaign spend allocation',      reference: 'SPEND-0091-060924', invoice: 'INV-2406' },
    { id: '2',  txnId: 'TXN-8820', date: '2024-06-08', campaign: 'Summer Sale 2024',    type: 'Ad Spend',     amount: -280,  tax: 50.40,  paymentMethod: 'Visa ----4242',       status: 'Completed',  campaignId: 'CAMP-0091', description: 'Daily campaign spend allocation',      reference: 'SPEND-0091-060824', invoice: 'INV-2405' },
    { id: '3',  txnId: 'TXN-8819', date: '2024-06-07', campaign: 'Promo Code Drive',    type: 'Ad Spend',     amount: -145,  tax: 26.10,  paymentMethod: 'Visa ----4242',       status: 'Completed',  campaignId: 'CAMP-0088', description: 'Promotional campaign spend',           reference: 'SPEND-0088-060724', invoice: 'INV-2404' },
    { id: '4',  txnId: 'TXN-8818', date: '2024-06-06', campaign: 'New Product Launch',  type: 'Ad Spend',     amount: -75,   tax: 13.50,  paymentMethod: 'Visa ----4242',       status: 'Processing', campaignId: 'CAMP-0095', description: 'Product launch ad spend',              reference: 'SPEND-0095-060624', invoice: 'INV-2403' },
    { id: '5',  txnId: 'TXN-8812', date: '2024-06-05', campaign: null,                  type: 'Top-up',       amount: 2000,  tax: null,   paymentMethod: 'Visa ----4242',       status: 'Completed',  reference: 'TOPUP-060524', invoice: 'INV-2401' },
    { id: '6',  txnId: 'TXN-8803', date: '2024-06-02', campaign: null,                  type: 'Platform Fee', amount: -99,   tax: 17.82,  paymentMethod: 'Visa ----4242',       status: 'Completed',  description: 'Monthly Pro Plan subscription',        reference: 'FEE-060224',    invoice: 'INV-2399' },
    { id: '7',  txnId: 'TXN-8798', date: '2024-05-31', campaign: 'App Install Drive',   type: 'Ad Spend',     amount: -480,  tax: 86.40,  paymentMethod: 'Mastercard ----5555', status: 'Completed',  campaignId: 'CAMP-0083', description: 'App install performance campaign',     reference: 'SPEND-0083-053124', invoice: 'INV-2398' },
    { id: '8',  txnId: 'TXN-8790', date: '2024-05-28', campaign: null,                  type: 'Top-up',       amount: 3000,  tax: null,   paymentMethod: 'Mastercard ----5555', status: 'Completed',  reference: 'TOPUP-052824', invoice: 'INV-2395' },
    { id: '9',  txnId: 'TXN-8784', date: '2024-05-25', campaign: 'Promo Code Drive',    type: 'Ad Spend',     amount: -215,  tax: 38.70,  paymentMethod: 'Visa ----4242',       status: 'Completed',  campaignId: 'CAMP-0088', description: 'Promotional campaign spend',           reference: 'SPEND-0088-052524', invoice: 'INV-2392' },
    { id: '10', txnId: 'TXN-8771', date: '2024-05-20', campaign: 'App Install Drive',   type: 'Ad Spend',     amount: -630,  tax: 113.40, paymentMethod: 'Visa ----4242',       status: 'Completed',  campaignId: 'CAMP-0083', description: 'App install performance campaign',     reference: 'SPEND-0083-052024', invoice: 'INV-2388' },
    { id: '11', txnId: 'TXN-8762', date: '2024-05-15', campaign: 'Flash Sale Campaign', type: 'Refund',       amount: 500,   tax: null,   paymentMethod: 'Visa ----4242',       status: 'Completed',  campaignId: 'CAMP-0079', description: 'Refund for cancelled campaign budget',  reference: 'REFUND-0079-051524', invoice: 'INV-2383' },
    { id: '12', txnId: 'TXN-8750', date: '2024-05-10', campaign: null,                  type: 'Top-up',       amount: 1000,  tax: null,   paymentMethod: 'Visa ----4242',       status: 'Completed',  reference: 'TOPUP-051024', invoice: 'INV-2380' },
    { id: '13', txnId: 'TXN-8741', date: '2024-05-08', campaign: 'App Install Drive',   type: 'Ad Spend',     amount: -989,  tax: 178.02, paymentMethod: 'Visa ----4242',       status: 'Completed',  campaignId: 'CAMP-0083', description: 'App install performance campaign',     reference: 'SPEND-0083-050824', invoice: 'INV-2375' },
    { id: '14', txnId: 'TXN-8726', date: '2024-05-02', campaign: null,                  type: 'Top-up',       amount: 500,   tax: null,   paymentMethod: 'Visa ----4242',       status: 'Completed',  reference: 'TOPUP-050224', invoice: 'INV-2370' },
  ];

  // ── Stats ─────────────────────────────────────────────────────────────
  get totalTransactions(): number { return this.rows.length; }

  get totalSpend(): number {
    return this.rows
      .filter(r => r.amount < 0 && r.status !== 'Processing' && r.status !== 'Pending')
      .reduce((s, r) => s + Math.abs(r.amount), 0);
  }

  get totalTopups(): number {
    return this.rows
      .filter(r => r.type === 'Top-up')
      .reduce((s, r) => s + r.amount, 0);
  }

  get netBalance(): number { return this.totalTopups - this.totalSpend; }

  // ── Active dropdown labels ────────────────────────────────────────────
  get activeDateLabel(): string {
    return this.dateOptions.find(o => o.value === this.dateFilter)?.label ?? 'All time';
  }

  get activeTypeLabel(): string {
    return this.typeOptions.find(o => o.value === this.typeFilter)?.label ?? 'All';
  }

  // ── Filtered + sorted rows ────────────────────────────────────────────
  get filtered(): TxnRow[] {
    let list = [...this.rows];

    if (this.dateFilter !== 'all') {
      const days   = this.dateFilter === '30d' ? 30 : 7;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      list = list.filter(r => new Date(r.date) >= cutoff);
    }

    if (this.typeFilter !== 'all') {
      list = list.filter(r => r.type === this.typeFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      list = list.filter(r =>
        r.txnId.toLowerCase().includes(q) ||
        (r.campaign?.toLowerCase().includes(q) ?? false)
      );
    }

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) =>
      this.sortField === 'txnId'  ? dir * a.txnId.localeCompare(b.txnId) :
      this.sortField === 'amount' ? dir * (a.amount - b.amount)          :
                                    dir * (new Date(a.date).getTime() - new Date(b.date).getTime())
    );

    return list;
  }

  get totalPages():  number   { return Math.max(1, Math.ceil(this.filtered.length / this.pageSize)); }
  get showingFrom(): number   { return this.filtered.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1; }
  get showingTo():   number   { return Math.min(this.currentPage * this.pageSize, this.filtered.length); }
  get pages():       number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  get paginatedRows(): TxnRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target as Node)) {
      if (this.showDateDrop || this.showTypeDrop) {
        this.showDateDrop = false;
        this.showTypeDrop = false;
        this.cdr.markForCheck();
      }
    }
  }

  toggleDateDrop(e: MouseEvent): void {
    e.stopPropagation();
    this.showDateDrop = !this.showDateDrop;
    this.showTypeDrop = false;
    this.cdr.markForCheck();
  }

  toggleTypeDrop(e: MouseEvent): void {
    e.stopPropagation();
    this.showTypeDrop = !this.showTypeDrop;
    this.showDateDrop = false;
    this.cdr.markForCheck();
  }

  setDateFilter(value: string, e: MouseEvent): void {
    e.stopPropagation();
    this.dateFilter   = value as DateFilter;
    this.showDateDrop = false;
    this.currentPage  = 1;
    this.cdr.markForCheck();
  }

  setTypeFilter(value: string, e: MouseEvent): void {
    e.stopPropagation();
    this.typeFilter   = value as TxnType | 'all';
    this.showTypeDrop = false;
    this.currentPage  = 1;
    this.cdr.markForCheck();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.cdr.markForCheck();
  }

  sortBy(field: SortField): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir   = 'desc';
    }
    this.cdr.markForCheck();
  }

  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages) {
      this.currentPage = p;
      this.cdr.markForCheck();
    }
  }

  openDetail(row: TxnRow): void {
    this.selectedTransaction = row;
    this.cdr.markForCheck();
  }

  closeDetail(): void {
    this.selectedTransaction = null;
    this.cdr.markForCheck();
  }

  // ── CSS helpers ───────────────────────────────────────────────────────
  typeClass(type: TxnType): string {
    const map: Record<TxnType, string> = {
      'Ad Spend':     'bt-type--spend',
      'Top-up':       'bt-type--topup',
      'Platform Fee': 'bt-type--fee',
      'Refund':       'bt-type--refund',
    };
    return map[type] ?? '';
  }

  statusClass(status: TxnStatus): string {
    const map: Record<TxnStatus, string> = {
      'Completed':  'bt-status--completed',
      'Processing': 'bt-status--processing',
      'Pending':    'bt-status--pending',
      'Failed':     'bt-status--failed',
    };
    return map[status] ?? '';
  }

  formatAmount(amount: number): string {
    const abs = Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 });
    return amount < 0 ? `-$${abs}` : `+$${abs}`;
  }

  formatStat(n: number): string {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
  }

  formatTax(tax: number | null): string {
    return tax === null ? '—' : '$' + tax.toFixed(2);
  }

  formatDate(d: string): string {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  }
}
