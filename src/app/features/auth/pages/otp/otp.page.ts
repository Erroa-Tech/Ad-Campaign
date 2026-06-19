import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-otp-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './otp.page.html',
  styleUrl: './otp.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpPageComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  readonly email = this.route.snapshot.queryParamMap.get('email') ?? '';
  readonly isLoading = signal(false);
  readonly submitted = signal(false);
  readonly resendCooldown = signal(0);

  readonly form = this.fb.nonNullable.group({
    d0: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    d1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    d2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    d3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    d4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    d5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
  });

  readonly digits = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'] as const;

  ngAfterViewInit(): void {
    this.digitInputs.first?.nativeElement.focus();
  }

  onDigitInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);
    input.value = value;

    const key = this.digits[index];
    this.form.controls[key].setValue(value, { emitEvent: false });

    if (value && index < 5) {
      this.digitInputs.get(index + 1)?.nativeElement.focus();
    }
  }

  onDigitKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      const key = this.digits[index];
      if (!this.form.controls[key].value && index > 0) {
        this.digitInputs.get(index - 1)?.nativeElement.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) ?? '';
    pasted.split('').forEach((char, i) => {
      const key = this.digits[i];
      if (key) {
        this.form.controls[key].setValue(char);
        this.digitInputs.get(i)?.nativeElement.setAttribute('value', char);
      }
    });
    const lastFilled = Math.min(pasted.length, 5);
    this.digitInputs.get(lastFilled)?.nativeElement.focus();
  }

  resendOtp(): void {
    this.resendCooldown.set(30);
    const interval = setInterval(() => {
      this.resendCooldown.update(v => {
        if (v <= 1) { clearInterval(interval); return 0; }
        return v - 1;
      });
    }, 1000);
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/auth/reset-password']);
    }, 1200);
  }
}
