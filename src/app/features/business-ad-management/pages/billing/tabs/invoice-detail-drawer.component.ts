import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceRow } from './billing-invoices.component';

@Component({
  selector: 'app-invoice-detail-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-detail-drawer.component.html',
  styleUrl: './invoice-detail-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDetailDrawerComponent {
  @Input({ required: true }) invoice!: InvoiceRow;
  @Output() closed = new EventEmitter<void>();

  readonly platform = {
    name:    'AdManager Platform',
    email:   'billing@admanager.io',
    address: '123 Platform Street SF CA 94107',
    gstin:   '06AABCU9603RIZP',
  };

  readonly billedTo = {
    company: 'Arjun Reyes Technologies Pvt. Ltd.',
    gstin:   '27AAPFU0939F1ZV',
    address: 'Mumbai, Maharashtra, India - 400001',
  };

  readonly financeContact = {
    name:  'Priya Sharma',
    email: 'finance@arjunreyes.io',
    phone: '+91 98200 12345',
  };

  @HostListener('document:keydown.escape')
  onEsc(): void { this.closed.emit(); }

  close(): void { this.closed.emit(); }

  getLineGst(amount: number):   number { return +(amount * 0.18).toFixed(2); }
  getLineTotal(amount: number): number { return +(amount + this.getLineGst(amount)).toFixed(2); }

  get subtotal(): number { return this.invoice.subtotal; }
  get igst():     number { return +(this.subtotal * 0.18).toFixed(2); }
  get total():    number { return +(this.subtotal + this.igst).toFixed(2); }

  fmt(n: number): string {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
  }

  get statusClass(): string {
    const map: Record<string, string> = {
      'Paid':    'idd-status--paid',
      'Due':     'idd-status--due',
      'Overdue': 'idd-status--overdue',
      'Draft':   'idd-status--draft',
    };
    return map[this.invoice.status] ?? '';
  }
}
