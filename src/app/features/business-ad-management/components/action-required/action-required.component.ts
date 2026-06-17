import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionItem } from '../../models/business-ad.models';

@Component({
  selector: 'app-bam-action-required',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-required.component.html',
  styleUrl: './action-required.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionRequiredComponent {
  @Input({ required: true }) items!: ActionItem[];
}
