import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

function mustBeTrue(control: AbstractControl): ValidationErrors | null {
  return control.value === true ? null : { mustBeTrue: true };
}

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly showPassword = signal(false);
  readonly isLoading = signal(false);
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    agreeToTerms: [false, [mustBeTrue]],
  });

  get fullNameCtrl() { return this.form.controls.fullName; }
  get emailCtrl() { return this.form.controls.email; }
  get passwordCtrl() { return this.form.controls.password; }
  get agreeToTermsCtrl() { return this.form.controls.agreeToTerms; }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/dashboard']);
    }, 1200);
  }
}
