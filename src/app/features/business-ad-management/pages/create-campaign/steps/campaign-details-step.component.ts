import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cc-campaign-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './campaign-details-step.component.html',
  styleUrl: './campaign-details-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignDetailsStepComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() submitted = false;

  readonly maxDescription = 280;

  readonly objective = [
    'Brand Awareness', 'Reach', 'Drive Traffic',
    'Conversions', 'App Installs', 'Engagement',
  ];

  readonly category = [
    'Retail & Commerce', 'Financial & Banking', 'Health & Wellness',
    'Food & Beverage', 'Entertainment', 'Education',
    'Travel & Hospitality', 'Automotive', 'Technology', 'Other',
  ];

  objectiveOpen = false;
  categoryOpen  = false;

  constructor(private cdr: ChangeDetectorRef) {}

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.objectiveOpen || this.categoryOpen) {
      this.objectiveOpen = false;
      this.categoryOpen  = false;
      this.cdr.markForCheck();
    }
  }

  toggleObjective(e: Event): void {
    e.stopPropagation();
    this.objectiveOpen = !this.objectiveOpen;
    this.categoryOpen  = false;
    this.cdr.markForCheck();
  }

  toggleCategory(e: Event): void {
    e.stopPropagation();
    this.categoryOpen  = !this.categoryOpen;
    this.objectiveOpen = false;
    this.cdr.markForCheck();
  }

  selectObjective(opt: string, e: Event): void {
    e.stopPropagation();
    this.form.get('objective')?.setValue(opt);
    this.form.get('objective')?.markAsTouched();
    this.objectiveOpen = false;
    this.cdr.markForCheck();
  }

  selectCategory(opt: string, e: Event): void {
    e.stopPropagation();
    this.form.get('category')?.setValue(opt);
    this.form.get('category')?.markAsTouched();
    this.categoryOpen = false;
    this.cdr.markForCheck();
  }

  get descriptionLength(): number {
    return (this.form.get('description')?.value ?? '').length;
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && (ctrl?.touched || this.submitted));
  }
}
