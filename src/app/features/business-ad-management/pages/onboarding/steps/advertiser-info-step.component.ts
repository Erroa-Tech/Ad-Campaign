import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-advertiser-info-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advertiser-info-step.component.html',
  styleUrl: './advertiser-info-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvertiserInfoStepComponent {
  @Input({ required: true }) form!: FormGroup;

  isDragOver      = false;
  selectedFileName: string | null = null;
  logoPreviewUrl:  string | null  = null;

  constructor(private cdr: ChangeDetectorRef) {}

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = true;
    this.cdr.markForCheck();
  }

  onDragLeave(): void {
    this.isDragOver = false;
    this.cdr.markForCheck();
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onFileSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.handleFile(file);
  }

  clearLogo(): void {
    this.selectedFileName = null;
    this.logoPreviewUrl   = null;
    this.cdr.markForCheck();
  }

  private handleFile(file: File): void {
    this.selectedFileName = file.name;
    const reader          = new FileReader();
    reader.onload = (ev) => {
      this.logoPreviewUrl = ev.target?.result as string;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
    this.cdr.markForCheck();
  }
}
