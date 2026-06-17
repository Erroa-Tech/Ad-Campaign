import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PlacementMeta {
  caption: string;
}

@Component({
  selector: 'app-cc-placement-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placement-preview.component.html',
  styleUrl: './placement-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlacementPreviewComponent {
  @Input() placementId = '';

  readonly meta: Record<string, PlacementMeta> = {
    'status-feed': { caption: 'Status Feed Ad — appears between statuses' },
    'full-screen': { caption: 'Full Screen Ad — shown between sessions'   },
    'call-screen': { caption: 'Call Screen Ad — shown on incoming calls'  },
    'banner':      { caption: 'Banner Ad — shown at top of app'           },
  };

  get caption(): string {
    return this.meta[this.placementId]?.caption ?? '';
  }
}
