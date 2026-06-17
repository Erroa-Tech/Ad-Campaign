import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingTransactionsComponent } from './tabs/billing-transactions.component';
import { BillingInvoicesComponent } from './tabs/billing-invoices.component';
import { BillingPaymentMethodsComponent } from './tabs/billing-payment-methods.component';
import { BillingProfileComponent } from './tabs/billing-profile.component';
import { TransactionStatus } from '../../models/business-ad.models';

export type BillingTab = 'wallet' | 'transactions' | 'invoices' | 'payment-methods' | 'billing-profile';

interface StatCard {
  label:    string;
  value:    string;
  iconType: 'spend' | 'recharge' | 'pending' | 'budget';
}

interface ActivityRow {
  id:       string;
  txnId:    string;
  name:     string;
  meta:     string;
  iconType: 'spend' | 'recharge' | 'fee';
  amount:   number;
  status:   TransactionStatus;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, BillingTransactionsComponent, BillingInvoicesComponent, BillingPaymentMethodsComponent, BillingProfileComponent],
  templateUrl: './billing.page.html',
  styleUrl: './billing.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingPageComponent {

  activeTab: BillingTab = 'wallet';
  autoRechargeEnabled = true;

  // ── Wallet summary ────────────────────────────────────────────────────
  readonly availableBalance = 4200;
  readonly lastUpdated = 'Jun 9, 2024 · 10:45 AM';

  readonly stats: StatCard[] = [
    { label: 'This Month Spend',      value: '$919.00',    iconType: 'spend'    },
    { label: 'Total Recharges',       value: '$6,000.00',  iconType: 'recharge' },
    { label: 'Pending Charges',       value: '$75.00',     iconType: 'pending'  },
    { label: 'Active Campaign Budget',value: '$5,800.00',  iconType: 'budget'   },
  ];

  // ── Recent activity ───────────────────────────────────────────────────
  readonly recentActivity: ActivityRow[] = [
    { id: '1', txnId: 'TXN-8821', name: 'Summer Sale 2024',           meta: 'Ad Spend · Jun 9, 2024',   iconType: 'spend',   amount: -320,  status: 'Completed' },
    { id: '2', txnId: 'TXN-8820', name: 'Summer Sale 2024',           meta: 'Ad Spend · Jun 8, 2024',   iconType: 'spend',   amount: -280,  status: 'Completed' },
    { id: '3', txnId: 'TXN-8819', name: 'Promo Code Drive',           meta: 'Ad Spend · Jun 7, 2024',   iconType: 'spend',   amount: -145,  status: 'Completed' },
    { id: '4', txnId: 'TXN-8818', name: 'New Product Launch',         meta: 'Ad Spend · Jun 6, 2024',   iconType: 'spend',   amount: -75,   status: 'Pending'   },
    { id: '5', txnId: 'TXN-8812', name: 'Manual wallet recharge',     meta: 'Recharge · Jun 5, 2024',   iconType: 'recharge',amount: 2000,  status: 'Completed' },
    { id: '6', txnId: 'TXN-8803', name: 'Monthly Pro Plan subscription', meta: 'Platform Fee · Jun 2, 2024', iconType: 'fee', amount: -99, status: 'Completed' },
    { id: '7', txnId: 'TXN-8798', name: 'App Install Drive',          meta: 'Ad Spend · May 31, 2024',  iconType: 'spend',   amount: -480,  status: 'Completed' },
    { id: '8', txnId: 'TXN-8790', name: 'Manual wallet recharge',     meta: 'Recharge · May 28, 2024',  iconType: 'recharge',amount: 3000,  status: 'Completed' },
  ];

  // ── Auto-recharge settings ────────────────────────────────────────────
  readonly autoRechargeSettings = {
    triggerThreshold: 'Below $1,000.00',
    rechargeAmount:   '$2,000.00',
    paymentMethod:    'Visa ----4242',
    monthlyLimit:     '$10,000.00',
  };

  // ── Monthly spend summary ─────────────────────────────────────────────
  readonly budgetAllocated = 5800;
  readonly spentToDate     = 919;
  get remaining(): number { return this.budgetAllocated - this.spentToDate; }
  get spentPercent(): number { return (this.spentToDate / this.budgetAllocated) * 100; }

  constructor(private cdr: ChangeDetectorRef) {}

  setTab(tab: BillingTab): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  toggleAutoRecharge(): void {
    this.autoRechargeEnabled = !this.autoRechargeEnabled;
    this.cdr.markForCheck();
  }

  // ── CSS helpers ───────────────────────────────────────────────────────
  statusClass(status: TransactionStatus): string {
    const map: Record<TransactionStatus, string> = {
      'Completed': 'fb-status--completed',
      'Pending':   'fb-status--pending',
      'Failed':    'fb-status--failed',
    };
    return map[status] ?? '';
  }

  formatAmount(amount: number): string {
    const abs = Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 });
    return amount < 0 ? `-$${abs}` : `+$${abs}`;
  }

  formatBalance(n: number): string {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
  }
}
