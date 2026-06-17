import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-business-ad-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './business-ad-layout.component.html',
  styleUrl: './business-ad-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessAdLayoutComponent {}
