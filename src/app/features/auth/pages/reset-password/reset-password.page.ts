import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pwd     = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pwd && confirm && pwd !== confirm ? { passwordsMismatch: true } : null;
}

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPageComponent {
  private readonly fb     = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly showNewPwd     = signal(false);
  readonly showConfirmPwd = signal(false);
  readonly isLoading      = signal(false);
  readonly submitted      = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      newPassword:     ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
    { validators: passwordsMatch },
  );

  get newPwdCtrl()     { return this.form.controls.newPassword; }
  get confirmPwdCtrl() { return this.form.controls.confirmPassword; }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/auth/login']);
    }, 1200);
  }
}
