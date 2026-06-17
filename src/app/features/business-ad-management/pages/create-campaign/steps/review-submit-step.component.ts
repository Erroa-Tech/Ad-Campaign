import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cc-review-submit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-submit-step.component.html',
  styleUrl: './review-submit-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewSubmitStepComponent {
  @Input({ required: true }) form!: FormGroup;

  private readonly placementNames: Record<string, string> = {
    'status-feed': 'Status Feed Ad',
    'full-screen': 'Full Screen Ad',
    'call-screen': 'Call Screen Ad',
    'banner':      'Banner Ad',
  };

  private readonly genderLabels: Record<string, string> = {
    'all':    'All Genders',
    'male':   'Male',
    'female': 'Female',
  };

  private readonly ageOrder = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'];
  private readonly ageLabels: Record<string, string> = {
    '13-17': '13–17', '18-24': '18–24', '25-34': '25–34',
    '35-44': '35–44', '45-54': '45–54', '55+': '55+',
  };
  private readonly ageMins: Record<string, number> = {
    '13-17': 13, '18-24': 18, '25-34': 25,
    '35-44': 35, '45-54': 45, '55+': 55,
  };

  // ── Private helpers ──────────────────────────────────

  private v(path: string): unknown {
    return this.form.get(path)?.value;
  }

  private str(path: string): string {
    return (this.v(path) as string)?.trim() || '—';
  }

  private get ageRangeLabel(): string {
    const ages = (this.v('audience.ageGroups') as string[]) ?? [];
    if (!ages.length) return 'All ages';
    const sorted = [...ages].sort(
      (a, b) => this.ageOrder.indexOf(a) - this.ageOrder.indexOf(b)
    );
    if (sorted.length === 1) return this.ageLabels[sorted[0]] ?? sorted[0];
    return `${this.ageMins[sorted[0]]}–${this.ageLabels[sorted[sorted.length - 1]]}`;
  }

  private get locationLabel(): string {
    const countries = (this.v('audience.countries') as string[]) ?? [];
    const states    = (this.v('audience.states')    as string[]) ?? [];
    if (!countries.length) return 'Nationwide';
    if (states.length)
      return `${countries.join(', ')} (${states.length} state${states.length > 1 ? 's' : ''})`;
    return countries.join(', ');
  }

  private get dailyBudgetLabel(): string {
    const n = parseFloat(this.v('budget.dailyBudget') as string);
    return isNaN(n) || n <= 0 ? '—' : '$' + n.toLocaleString('en-US') + '/Day';
  }

  private get durationDays(): number | null {
    const start = this.v('budget.startDate') as string;
    const end   = this.v('budget.endDate')   as string;
    if (!start || !end) return null;
    const d = Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000
    );
    return d > 0 ? d : null;
  }

  private get durationLabel(): string {
    const d = this.durationDays;
    return d !== null ? `${d} day${d > 1 ? 's' : ''}` : '—';
  }

  private get estSpendLabel(): string {
    const daily = parseFloat(this.v('budget.dailyBudget') as string);
    const days  = this.durationDays;
    if (isNaN(daily) || days === null) return '—';
    return '$' + (daily * days).toLocaleString('en-US');
  }

  // ── Public: review rows ──────────────────────────────

  get reviewRows(): { key: string; value: string }[] {
    const placementId = this.v('placement.placementId') as string;
    const gender      = this.v('audience.gender') as string;
    return [
      { key: 'Campaign Name',    value: this.str('details.campaignName')            },
      { key: 'Objective',        value: this.str('details.objective')               },
      { key: 'Category',         value: this.str('details.category')                },
      { key: 'Placement',        value: this.placementNames[placementId] ?? '—'     },
      { key: 'Gender',           value: this.genderLabels[gender]        ?? '—'     },
      { key: 'Age Range',        value: this.ageRangeLabel                          },
      { key: 'Location',         value: this.locationLabel                          },
      { key: 'Daily Budget',     value: this.dailyBudgetLabel                       },
      { key: 'Duration',         value: this.durationLabel                          },
      { key: 'Est. Total Spend', value: this.estSpendLabel                          },
    ];
  }
}
