import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cc-budget-duration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './budget-duration-step.component.html',
  styleUrl: './budget-duration-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetDurationStepComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() submitted = false;

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && (ctrl?.touched || this.submitted));
  }
  

  // ── Computed summary ─────────────────────────────────

  get dailyBudgetValue(): number | null {
    const v = parseFloat(this.form.get('dailyBudget')?.value);
    return isNaN(v) || v <= 0 ? null : v;
  }

  get durationDays(): number | null {
    const start = this.form.get('startDate')?.value;
    const end   = this.form.get('endDate')?.value;
    if (!start || !end) return null;
    const days = Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000
    );
    return days > 0 ? days : null;
  }

  get estTotalSpend(): number | null {
    const daily = this.dailyBudgetValue;
    const days  = this.durationDays;
    return daily !== null && days !== null ? daily * days : null;
  }

  get showSummary(): boolean {
    return this.dailyBudgetValue !== null;
  }

  fmtUsd(n: number): string {
    return '$' + n.toLocaleString('en-US');
  }
}
