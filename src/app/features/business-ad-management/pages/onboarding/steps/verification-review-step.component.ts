import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { UploadedDoc } from '../onboarding.models';

@Component({
  selector: 'app-verification-review-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verification-review-step.component.html',
  styleUrl: './verification-review-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationReviewStepComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() documents: UploadedDoc[] = [];
  @Output() editInfoRequested = new EventEmitter<void>();

  val(field: string): string {
    return this.form.get(field)?.value?.trim() || '—';
  }
}
