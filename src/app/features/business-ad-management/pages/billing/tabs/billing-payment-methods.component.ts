import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SavedCard {
  id:          string;
  last4:       string;
  holderName:  string;
  expiry:      string;
  addedDate:   string;
  isDefault:   boolean;
  network:     'visa' | 'mastercard';
}

interface UpiId {
  id:          string;
  upiHandle:   string;
  bankName:    string;
  addedDate:   string;
  isDefault:   boolean;
}

interface BankAccount {
  id:           string;
  bankName:     string;
  accountMask:  string;
  accountType:  string;
  ifsc:         string;
  accountHolder:string;
  isDefault:    boolean;
}

@Component({
  selector: 'app-billing-payment-methods',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing-payment-methods.component.html',
  styleUrl: './billing-payment-methods.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingPaymentMethodsComponent {

  cards: SavedCard[] = [
    {
      id: '1', last4: '4242', holderName: 'Arjun Shende',
      expiry: '11/2026', addedDate: 'June 2, 2026',
      isDefault: true, network: 'visa',
    },
    {
      id: '2', last4: '5555', holderName: 'Arjun Shende',
      expiry: '11/2026', addedDate: 'June 2, 2026',
      isDefault: false, network: 'mastercard',
    },
  ];

  upiIds: UpiId[] = [
    {
      id: '1', upiHandle: 'arjun.reyes@paytm',
      bankName: 'Paytm Payments Bank', addedDate: 'Feb 10, 2024',
      isDefault: false,
    },
  ];

  bankAccounts: BankAccount[] = [
    {
      id: '1', bankName: 'HDFC Bank', accountMask: '------6789',
      accountType: 'Current Account', ifsc: 'HDFC0001234',
      accountHolder: 'Arjun Reyes Technologies Pvt. Ltd.',
      isDefault: false,
    },
  ];

  // ── Add Card form state ───────────────────────────────────────────────
  showAddCard    = false;
  newCardNumber  = '';
  newCardExpiry  = '';
  newCardCvv     = '';
  newCardHolder  = '';

  // ── Add UPI form state ────────────────────────────────────────────────
  showAddUpi     = false;
  newUpiHandle   = '';
  newUpiBankName = '';

  // ── Add Bank form state ───────────────────────────────────────────────
  showAddBank      = false;
  newBankName      = '';
  newBankAccount   = '';
  newBankIfsc      = '';
  newBankHolder    = '';
  newBankAccType   = 'Savings Account';

  constructor(private cdr: ChangeDetectorRef) {}

  get savedCardCount(): number { return this.cards.length; }

  // ── Card methods ──────────────────────────────────────────────────────
  openAddCard(): void {
    this.showAddCard   = true;
    this.newCardNumber = '';
    this.newCardExpiry = '';
    this.newCardCvv    = '';
    this.newCardHolder = '';
    this.cdr.markForCheck();
  }

  cancelAddCard(): void {
    this.showAddCard = false;
    this.cdr.markForCheck();
  }

  saveCard(): void {
    if (!this.newCardNumber || !this.newCardExpiry || !this.newCardHolder) return;
    const raw   = this.newCardNumber.replace(/\s/g, '');
    const last4 = raw.slice(-4);
    this.cards = [
      ...this.cards,
      {
        id:         Date.now().toString(),
        last4,
        holderName: this.newCardHolder.trim(),
        expiry:     this.newCardExpiry.trim(),
        addedDate:  new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        isDefault:  this.cards.length === 0,
        network:    'visa',
      },
    ];
    this.showAddCard = false;
    this.cdr.markForCheck();
  }

  setCardDefault(id: string): void {
    this.cards = this.cards.map(c => ({ ...c, isDefault: c.id === id }));
    this.cdr.markForCheck();
  }

  removeCard(id: string): void {
    this.cards = this.cards.filter(c => c.id !== id);
    this.cdr.markForCheck();
  }

  // ── UPI methods ───────────────────────────────────────────────────────
  openAddUpi(): void {
    this.showAddUpi    = true;
    this.newUpiHandle  = '';
    this.newUpiBankName= '';
    this.cdr.markForCheck();
  }

  cancelAddUpi(): void {
    this.showAddUpi = false;
    this.cdr.markForCheck();
  }

  saveUpi(): void {
    if (!this.newUpiHandle) return;
    this.upiIds = [
      ...this.upiIds,
      {
        id:        Date.now().toString(),
        upiHandle: this.newUpiHandle.trim(),
        bankName:  this.newUpiBankName.trim() || 'UPI',
        addedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        isDefault: this.upiIds.length === 0,
      },
    ];
    this.showAddUpi = false;
    this.cdr.markForCheck();
  }

  setUpiDefault(id: string): void {
    this.upiIds = this.upiIds.map(u => ({ ...u, isDefault: u.id === id }));
    this.cdr.markForCheck();
  }

  removeUpi(id: string): void {
    this.upiIds = this.upiIds.filter(u => u.id !== id);
    this.cdr.markForCheck();
  }

  // ── Bank methods ──────────────────────────────────────────────────────
  openAddBank(): void {
    this.showAddBank    = true;
    this.newBankName    = '';
    this.newBankAccount = '';
    this.newBankIfsc    = '';
    this.newBankHolder  = '';
    this.newBankAccType = 'Savings Account';
    this.cdr.markForCheck();
  }

  cancelAddBank(): void {
    this.showAddBank = false;
    this.cdr.markForCheck();
  }

  saveBank(): void {
    if (!this.newBankName || !this.newBankAccount) return;
    const raw  = this.newBankAccount.replace(/\s/g, '');
    const mask = '------' + raw.slice(-4);
    this.bankAccounts = [
      ...this.bankAccounts,
      {
        id:            Date.now().toString(),
        bankName:      this.newBankName.trim(),
        accountMask:   mask,
        accountType:   this.newBankAccType,
        ifsc:          this.newBankIfsc.trim().toUpperCase(),
        accountHolder: this.newBankHolder.trim(),
        isDefault:     this.bankAccounts.length === 0,
      },
    ];
    this.showAddBank = false;
    this.cdr.markForCheck();
  }

  setBankDefault(id: string): void {
    this.bankAccounts = this.bankAccounts.map(b => ({ ...b, isDefault: b.id === id }));
    this.cdr.markForCheck();
  }

  removeBank(id: string): void {
    this.bankAccounts = this.bankAccounts.filter(b => b.id !== id);
    this.cdr.markForCheck();
  }

  // ── Card number formatter ─────────────────────────────────────────────
  formatCardInput(): void {
    const digits = this.newCardNumber.replace(/\D/g, '').slice(0, 16);
    this.newCardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
    this.cdr.markForCheck();
  }
}
