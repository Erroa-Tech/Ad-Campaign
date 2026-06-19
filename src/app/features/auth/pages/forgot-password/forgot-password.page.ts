import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get emailCtrl() { return this.form.controls.email; }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/auth/otp'], {
        queryParams: { email: this.emailCtrl.value },
      });
    }, 1200);
  }
}
