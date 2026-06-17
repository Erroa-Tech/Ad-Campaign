import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceDetailDrawerComponent } from './invoice-detail-drawer.component';

export type InvoiceStatus = 'Paid' | 'Due' | 'Overdue' | 'Draft';

export interface InvoiceLineItem {
  description: string;
  amount:      number;
}

export interface InvoiceRow {
  id:            string;
  invoiceId:     string;
  billingPeriod: string;
  issueDate:     string;
  dueDate:       string;
  subtotal:      number;
  status:        InvoiceStatus;
  lineItems:     InvoiceLineItem[];
}

@Component({
  selector: 'app-billing-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, InvoiceDetailDrawerComponent],
  templateUrl: './billing-invoices.component.html',
  styleUrl: './billing-invoices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingInvoicesComponent {

  searchQuery    = '';
  statusFilter: InvoiceStatus | 'all' = 'all';
  showStatusDrop = false;
  selectedInvoice: InvoiceRow | null  = null;

  readonly statusOptions: { value: InvoiceStatus | 'all'; label: string }[] = [
    { value: 'all',      label: 'All'      },
    { value: 'Paid',     label: 'Paid'     },
    { value: 'Due',      label: 'Due'      },
    { value: 'Overdue',  label: 'Overdue'  },
    { value: 'Draft',    label: 'Draft'    },
  ];

  readonly invoices: InvoiceRow[] = [
    {
      id: '1', invoiceId: 'INV-2406', billingPeriod: 'Jun 2024', issueDate: 'Jul 1, 2024',  dueDate: 'Jul 15, 2024',  subtotal: 3939, status: 'Due',
      lineItems: [
        { description: 'Ad Campaigns — June 2024',           amount: 3840 },
        { description: 'Platform Fee (Pro Plan) — June 2024', amount: 99  },
      ],
    },
    {
      id: '2', invoiceId: 'INV-2405', billingPeriod: 'May 2024', issueDate: 'Jun 1, 2024',  dueDate: 'Jun 15, 2024',  subtotal: 3314, status: 'Paid',
      lineItems: [
        { description: 'Ad Campaigns — May 2024',           amount: 3215 },
        { description: 'Platform Fee (Pro Plan) — May 2024', amount: 99  },
      ],
    },
    {
      id: '3', invoiceId: 'INV-2404', billingPeriod: 'Apr 2024', issueDate: 'May 1, 2024',  dueDate: 'May 15, 2024',  subtotal: 4298, status: 'Paid',
      lineItems: [
        { description: 'Ad Campaigns — April 2024',           amount: 4199 },
        { description: 'Platform Fee (Pro Plan) — April 2024', amount: 99  },
      ],
    },
    {
      id: '4', invoiceId: 'INV-2403', billingPeriod: 'Mar 2024', issueDate: 'Apr 1, 2024',  dueDate: 'Apr 15, 2024',  subtotal: 1799, status: 'Paid',
      lineItems: [
        { description: 'Ad Campaigns — March 2024',           amount: 1700 },
        { description: 'Platform Fee (Pro Plan) — March 2024', amount: 99  },
      ],
    },
    {
      id: '5', invoiceId: 'INV-2402', billingPeriod: 'Feb 2024', issueDate: 'Mar 1, 2024',  dueDate: 'Mar 15, 2024',  subtotal: 1199, status: 'Paid',
      lineItems: [
        { description: 'Ad Campaigns — February 2024',           amount: 1100 },
        { description: 'Platform Fee (Pro Plan) — February 2024', amount: 99  },
      ],
    },
    {
      id: '6', invoiceId: 'INV-2401', billingPeriod: 'Jan 2024', issueDate: 'Feb 1, 2024',  dueDate: 'Feb 15, 2024',  subtotal: 899, status: 'Paid',
      lineItems: [
        { description: 'Ad Campaigns — January 2024',           amount: 800 },
        { description: 'Platform Fee (Pro Plan) — January 2024', amount: 99 },
      ],
    },
  ];

  // ── Stats ─────────────────────────────────────────────────────────────
  get totalInvoices():   number { return this.invoices.length; }
  get totalPaid():       number { return this.invoices.filter(i => i.status === 'Paid').length; }
  get totalOutstanding():number { return this.invoices.filter(i => i.status !== 'Paid').length; }
  get totalValue():      number { return this.invoices.reduce((s, i) => s + this.getTotal(i), 0); }

  getGst(inv: InvoiceRow):   number { return +(inv.subtotal * 0.18).toFixed(2); }
  getTotal(inv: InvoiceRow): number { return +(inv.subtotal + this.getGst(inv)).toFixed(2); }

  get activeStatusLabel(): string {
    return this.statusOptions.find(o => o.value === this.statusFilter)?.label ?? 'All';
  }

  // ── Filtered rows ─────────────────────────────────────────────────────
  get filtered(): InvoiceRow[] {
    let list = [...this.invoices];

    if (this.statusFilter !== 'all') {
      list = list.filter(i => i.status === this.statusFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      list = list.filter(i =>
        i.invoiceId.toLowerCase().includes(q) ||
        i.billingPeriod.toLowerCase().includes(q)
      );
    }

    return list;
  }

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target as Node) && this.showStatusDrop) {
      this.showStatusDrop = false;
      this.cdr.markForCheck();
    }
  }

  toggleStatusDrop(e: MouseEvent): void {
    e.stopPropagation();
    this.showStatusDrop = !this.showStatusDrop;
    this.cdr.markForCheck();
  }

  setStatusFilter(value: string, e: MouseEvent): void {
    e.stopPropagation();
    this.statusFilter   = value as InvoiceStatus | 'all';
    this.showStatusDrop = false;
    this.cdr.markForCheck();
  }

  onSearch(): void { this.cdr.markForCheck(); }

  openDetail(inv: InvoiceRow): void {
    this.selectedInvoice = inv;
    this.cdr.markForCheck();
  }

  closeDetail(): void {
    this.selectedInvoice = null;
    this.cdr.markForCheck();
  }

  statusClass(status: InvoiceStatus): string {
    const map: Record<InvoiceStatus, string> = {
      'Paid':    'bi-status--paid',
      'Due':     'bi-status--due',
      'Overdue': 'bi-status--overdue',
      'Draft':   'bi-status--draft',
    };
    return map[status] ?? '';
  }

  formatUsd(n: number): string {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
  }

  formatSubtotal(n: number): string {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
  }

  formatTotalValue(n: number): string {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
  }
}
