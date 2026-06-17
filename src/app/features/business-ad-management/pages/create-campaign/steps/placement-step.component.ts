import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

interface PlacementOption {
  id: string;
  name: string;
  description: string;
  dimensions: string;
  format: string;
  cpmRange: string;
}

@Component({
  selector: 'app-cc-placement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './placement-step.component.html',
  styleUrl: './placement-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlacementStepComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() submitted = false;
  @Output() selectionChange = new EventEmitter<string>();

  get isPlacementInvalid(): boolean {
    const ctrl = this.form.get('placementId');
    return !!(ctrl?.invalid && (ctrl?.touched || this.submitted));
  }

  readonly placements: PlacementOption[] = [
    {
      id: 'status-feed',
      name: 'Status Feed Ad',
      description: 'Appears naturally between status updates in the main social feed.',
      dimensions: '1080 × 1080',
      format: 'Image / Video',
      cpmRange: '$2.40–$4.80',
    },
    {
      id: 'full-screen',
      name: 'Full Screen Ad',
      description: 'Full-screen interstitial shown between app sessions or incoming calls.',
      dimensions: '1080 × 1920',
      format: 'Image / Video',
      cpmRange: '$5.20–$9.60',
    },
    {
      id: 'call-screen',
      name: 'Call Screen Ad',
      description: 'Displayed on the incoming call screen — high-visibility placement.',
      dimensions: '1080 × 1920',
      format: 'Image / Video',
      cpmRange: '$4.00–$7.50',
    },
    {
      id: 'banner',
      name: 'Banner Ad',
      description: 'Compact banner shown at the top or bottom of the app interface.',
      dimensions: '1080 × 200',
      format: 'Image',
      cpmRange: '$0.80–$2.10',
    },
  ];

  get selectedId(): string {
    return this.form.get('placementId')?.value ?? '';
  }

  select(id: string): void {
    this.form.get('placementId')?.setValue(id);
    this.selectionChange.emit(id);
  }
}
