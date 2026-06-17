import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProfileField {
  label: string;
  value: string;
  key:   string;
}

interface BillingAddress {
  addressLine1: string;
  addressLine2: string;
  city:         string;
  state:        string;
  pincode:      string;
  country:      string;
}

interface FinanceContact {
  contactName:  string;
  emailAddress: string;
  phoneNumber:  string;
}

@Component({
  selector: 'app-billing-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing-profile.component.html',
  styleUrl: './billing-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingProfileComponent {

  isEditing = false;

  // ── Legal Business Information ────────────────────────────────────────
  legalInfo: ProfileField[] = [
    { label: 'Legal Business Name', value: 'Arjun Reyes Technologies Pvt. Ltd.', key: 'legalName'  },
    { label: 'GSTIN / Tax ID',      value: '27AAPFU0939F1ZV',                    key: 'gstin'      },
    { label: 'PAN Number',          value: 'AAPFU0939F',                          key: 'pan'        },
  ];

  // ── Billing Address ───────────────────────────────────────────────────
  address: BillingAddress = {
    addressLine1: 'Smriti Nagar',
    addressLine2: 'Bhilai, C.G',
    city:         'Mumbai',
    state:        'Maharashtra',
    pincode:      '400072',
    country:      'India',
  };

  // ── Finance Contact ───────────────────────────────────────────────────
  financeContact: FinanceContact = {
    contactName:  'Priya Sharma',
    emailAddress: 'finance@arjunreyes.io',
    phoneNumber:  '+91 98200 12345',
  };

  // ── Edit state snapshots (restored on cancel) ─────────────────────────
  private _legalInfoSnap!: ProfileField[];
  private _addressSnap!:   BillingAddress;
  private _contactSnap!:   FinanceContact;

  get gstinValue(): string {
    return this.legalInfo.find(f => f.key === 'gstin')?.value ?? '';
  }

  get addressFields(): { label: string; value: keyof BillingAddress }[] {
    return [
      { label: 'Address Line 1', value: 'addressLine1' },
      { label: 'Address Line 2', value: 'addressLine2' },
      { label: 'City',           value: 'city'          },
      { label: 'State',          value: 'state'         },
      { label: 'Pincode',        value: 'pincode'       },
      { label: 'Country',        value: 'country'       },
    ];
  }

  get contactFields(): { label: string; value: keyof FinanceContact }[] {
    return [
      { label: 'Contact Name',  value: 'contactName'  },
      { label: 'Email Address', value: 'emailAddress' },
      { label: 'Phone Number',  value: 'phoneNumber'  },
    ];
  }

  constructor(private cdr: ChangeDetectorRef) {}

  startEdit(): void {
    this._legalInfoSnap = this.legalInfo.map(f => ({ ...f }));
    this._addressSnap   = { ...this.address };
    this._contactSnap   = { ...this.financeContact };
    this.isEditing      = true;
    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.legalInfo      = this._legalInfoSnap;
    this.address        = this._addressSnap;
    this.financeContact = this._contactSnap;
    this.isEditing      = false;
    this.cdr.markForCheck();
  }

  saveProfile(): void {
    this.isEditing = false;
    this.cdr.markForCheck();
  }
}
