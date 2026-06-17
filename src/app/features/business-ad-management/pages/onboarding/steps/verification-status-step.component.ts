import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

export type VerificationTab = 'under-review' | 'approved' | 'rejected';

interface ChecklistItem {
  id:     string;
  label:  string;
  status: 'done' | 'pending' | 'failed';
}

@Component({
  selector: 'app-verification-status-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verification-status-step.component.html',
  styleUrl: './verification-status-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationStatusStepComponent implements OnInit {
  @Input({ required: true }) form!: FormGroup;

  activeTab: VerificationTab = 'under-review';
  showToast = true;

  readonly checklist: ChecklistItem[] = [
    { id: 'submitted',    label: 'Application submitted',       status: 'done'    },
    { id: 'authenticity', label: 'Document authenticity check', status: 'done'    },
    { id: 'identity',     label: 'Business identity review',    status: 'pending' },
    { id: 'approval',     label: 'Final approval decision',     status: 'pending' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showToast = false;
      this.cdr.markForCheck();
    }, 5000);
  }

  switchTab(tab: VerificationTab): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  val(field: string): string {
    return this.form.get(field)?.value?.trim() || '—';
  }
}
