import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketCategory, TicketPriority } from '../../models/business-ad.models';

export interface NewTicketData {
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  relatedCampaign: string;
  description: string;
}

@Component({
  selector: 'app-create-ticket-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-ticket-modal.component.html',
  styleUrl: './create-ticket-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTicketModalComponent {
  @Output() closed    = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<NewTicketData>();

  readonly categories: TicketCategory[] = [
    'Approval Issue', 'Payment Issue', 'Ad Performance', 'General',
  ];

  readonly priorities: TicketPriority[] = ['High', 'Medium', 'Low'];

  selectedCategory: TicketCategory | null = null;
  selectedPriority: TicketPriority = 'Medium';
  categoryTouched = false;

  readonly form: FormGroup;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      subject:         ['', Validators.required],
      relatedCampaign: [''],
      description:     ['', Validators.required],
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.close(); }

  selectCategory(cat: TicketCategory): void {
    this.selectedCategory = cat;
    this.cdr.markForCheck();
  }

  selectPriority(p: TicketPriority): void {
    this.selectedPriority = p;
    this.cdr.markForCheck();
  }

  close(): void { this.closed.emit(); }

  submit(): void {
    this.categoryTouched = true;
    this.form.markAllAsTouched();
    this.cdr.markForCheck();

    if (!this.form.valid || !this.selectedCategory) return;

    this.submitted.emit({
      category:        this.selectedCategory,
      priority:        this.selectedPriority,
      subject:         this.form.value.subject.trim(),
      relatedCampaign: this.form.value.relatedCampaign.trim(),
      description:     this.form.value.description.trim(),
    });
    this.close();
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
