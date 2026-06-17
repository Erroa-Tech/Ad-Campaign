import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadedDoc } from '../onboarding.models';

interface DocumentUpload {
  id:          string;
  label:       string;
  description: string;
  required:    boolean;
  isDragOver:  boolean;
  file:        File | null;
  fileName:    string | null;
}

@Component({
  selector: 'app-business-verification-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-verification-step.component.html',
  styleUrl: './business-verification-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessVerificationStepComponent {

  @Output() documentsChanged = new EventEmitter<UploadedDoc[]>();

  documents: DocumentUpload[] = [
    {
      id: 'reg-cert',
      label: 'Business Registration Certificate',
      description: 'Certificate of incorporation, shop act, or local registration proof.',
      required: true, isDragOver: false, file: null, fileName: null,
    },
    {
      id: 'tax-cert',
      label: 'Tax ID / GST Certificate',
      description: 'Tax registration proof matching your Tax ID / GST number.',
      required: true, isDragOver: false, file: null, fileName: null,
    },
    {
      id: 'gov-license',
      label: 'Government License',
      description: 'Industry license, trade license, FSSAI, RBI, or equivalent where applicable.',
      required: false, isDragOver: false, file: null, fileName: null,
    },
    {
      id: 'supporting',
      label: 'Additional Supporting Documents',
      description: 'Optional proof such as authorization letters or agency mandates.',
      required: false, isDragOver: false, file: null, fileName: null,
    },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  onDragOver(e: DragEvent, docId: string): void {
    e.preventDefault();
    this.updateDoc(docId, { isDragOver: true });
  }

  onDragLeave(docId: string): void {
    this.updateDoc(docId, { isDragOver: false });
  }

  onDrop(e: DragEvent, docId: string): void {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) this.handleFile(file, docId);
    else this.updateDoc(docId, { isDragOver: false });
  }

  onFileSelected(e: Event, docId: string): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.handleFile(file, docId);
  }

  clearFile(docId: string, e: Event): void {
    e.stopPropagation();
    this.updateDoc(docId, { file: null, fileName: null });
  }

  triggerInput(docId: string): void {
    (document.getElementById('bv-file-' + docId) as HTMLInputElement)?.click();
  }

  private handleFile(file: File, docId: string): void {
    this.updateDoc(docId, { file, fileName: file.name, isDragOver: false });
  }

  private updateDoc(docId: string, patch: Partial<DocumentUpload>): void {
    this.documents = this.documents.map(d =>
      d.id === docId ? { ...d, ...patch } : d
    );
    this.emitDocs();
    this.cdr.markForCheck();
  }

  private emitDocs(): void {
    const uploaded = this.documents
      .filter(d => d.file)
      .map(d => ({
        label:    d.label,
        fileName: d.fileName!,
        fileSize: this.formatSize(d.file!.size),
      }));
    this.documentsChanged.emit(uploaded);
  }

  private formatSize(bytes: number): string {
    const kb = bytes / 1024;
    return kb < 1024
      ? kb.toFixed(1) + ' KB'
      : (kb / 1024).toFixed(1) + ' MB';
  }
}
