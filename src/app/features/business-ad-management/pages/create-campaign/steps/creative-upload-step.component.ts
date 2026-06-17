import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cc-creative-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creative-upload-step.component.html',
  styleUrl: './creative-upload-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreativeUploadStepComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() submitted = false;

  isDragOver = false;

  get isFileInvalid(): boolean {
    const ctrl = this.form.get('file');
    return !!(ctrl?.invalid && (ctrl?.touched || this.submitted));
  }

  constructor(private cdr: ChangeDetectorRef) {}

  get mediaType(): 'image' | 'video' {
    return this.form.get('mediaType')?.value ?? 'image';
  }

  get selectedFile(): File | null {
    return this.form.get('file')?.value ?? null;
  }

  selectMediaType(type: 'image' | 'video'): void {
    this.form.get('mediaType')?.setValue(type);
  }

  openFilePicker(input: HTMLInputElement): void {
    input.click();
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.form.get('file')?.setValue(file);
    this.cdr.markForCheck();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.isDragOver) {
      this.isDragOver = true;
      this.cdr.markForCheck();
    }
  }

  onDragLeave(): void {
    this.isDragOver = false;
    this.cdr.markForCheck();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files?.[0] ?? null;
    if (file) this.form.get('file')?.setValue(file);
    this.cdr.markForCheck();
  }
}
