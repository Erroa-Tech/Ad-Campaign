import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth-promo-panel',
  standalone: true,
  templateUrl: './auth-promo-panel.component.html',
  styleUrl: './auth-promo-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPromoPanelComponent {}
