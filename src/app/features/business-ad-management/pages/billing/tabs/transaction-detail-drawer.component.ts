import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TxnRow, TxnType } from './billing-transactions.component';

interface TimelineEvent {
  label:    string;
  datetime: string;
}

@Component({
  selector: 'app-transaction-detail-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-detail-drawer.component.html',
  styleUrl: './transaction-detail-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDetailDrawerComponent {
  @Input({ required: true }) transaction!: TxnRow;
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEsc(): void { this.closed.emit(); }

  get total(): number {
    return Math.abs(this.transaction.amount) + (this.transaction.tax ?? 0);
  }

  get formattedDate(): string {
    return new Date(this.transaction.date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  }

  get timeline(): TimelineEvent[] {
    const d = this.formattedDate;
    const map: Record<TxnType, TimelineEvent[]> = {
      'Ad Spend': [
        { label: 'Transaction Initiated',     datetime: `${d} · 10:22 AM` },
        { label: 'Payment Processed',         datetime: `${d} · 10:22 AM` },
        { label: 'Campaign Budget Allocated', datetime: `${d} · 10:23 AM` },
        { label: 'Settlement Complete',       datetime: `${d} · 11:00 AM` },
      ],
      'Top-up': [
        { label: 'Payment Received',    datetime: `${d} · 09:00 AM` },
        { label: 'Wallet Credited',     datetime: `${d} · 09:01 AM` },
        { label: 'Settlement Complete', datetime: `${d} · 09:15 AM` },
      ],
      'Platform Fee': [
        { label: 'Invoice Generated',   datetime: `${d} · 08:00 AM` },
        { label: 'Payment Processed',   datetime: `${d} · 08:30 AM` },
        { label: 'Settlement Complete', datetime: `${d} · 09:00 AM` },
      ],
      'Refund': [
        { label: 'Refund Initiated',    datetime: `${d} · 10:00 AM` },
        { label: 'Amount Reversed',     datetime: `${d} · 10:05 AM` },
        { label: 'Wallet Credited',     datetime: `${d} · 10:10 AM` },
      ],
    };
    return map[this.transaction.type] ?? [];
  }

  statusClass(): string {
    const map: Record<string, string> = {
      'Completed':  'tdd-badge--completed',
      'Processing': 'tdd-badge--processing',
      'Pending':    'tdd-badge--pending',
      'Failed':     'tdd-badge--failed',
    };
    return map[this.transaction.status] ?? '';
  }

  typeClass(): string {
    const map: Record<TxnType, string> = {
      'Ad Spend':     'tdd-badge--spend',
      'Top-up':       'tdd-badge--topup',
      'Platform Fee': 'tdd-badge--fee',
      'Refund':       'tdd-badge--refund',
    };
    return map[this.transaction.type] ?? '';
  }

  formatAmount(amount: number): string {
    const abs = Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 });
    return amount < 0 ? `-$${abs}` : `+$${abs}`;
  }

  formatUsd(n: number): string {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
  }
}
