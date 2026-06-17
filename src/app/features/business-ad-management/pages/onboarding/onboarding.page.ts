import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdvertiserInfoStepComponent } from './steps/advertiser-info-step.component';
import { BusinessVerificationStepComponent } from './steps/business-verification-step.component';
import { VerificationReviewStepComponent } from './steps/verification-review-step.component';
import { VerificationStatusStepComponent } from './steps/verification-status-step.component';
import { UploadedDoc } from './onboarding.models';

type StepStatus = 'active' | 'completed' | 'pending';
type StepIcon   = 'user' | 'building' | 'document' | 'shield';

interface OnboardingStep {
  number:      number;
  label:       string;
  subtitle:    string;
  category:    string;
  description: string;
  nextLabel:   string;
  icon:        StepIcon;
  status:      StepStatus;
}

@Component({
  selector: 'app-advertiser-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdvertiserInfoStepComponent,
    BusinessVerificationStepComponent,
    VerificationReviewStepComponent,
    VerificationStatusStepComponent,
  ],
  templateUrl: './onboarding.page.html',
  styleUrl: './onboarding.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingPageComponent implements OnInit {

  currentStep = 1;
  readonly totalSteps = 4;

  advertiserForm!: FormGroup;
  uploadedDocs: UploadedDoc[] = [];

  readonly stepDefs: Omit<OnboardingStep, 'status'>[] = [
    {
      number: 1, label: 'Advertiser Information', subtitle: 'Step 1',
      category: 'ADVERTISER', icon: 'user', nextLabel: 'Continue',
      description: 'Add all advertiser, company, and branding details in one simplified workflow.',
    },
    {
      number: 2, label: 'Business Verification', subtitle: 'Step 2',
      category: 'DOCUMENTS', icon: 'building', nextLabel: 'Review Verification',
      description: 'Upload verification documents that prove business identity and tax registration.',
    },
    {
      number: 3, label: 'Verification Review', subtitle: 'Step 3',
      category: 'REVIEW', icon: 'document', nextLabel: 'Submit For Verification',
      description: 'Review information before sending it to the compliance team.',
    },
    {
      number: 4, label: 'Verification Status', subtitle: 'Step 4',
      category: 'STATUS', icon: 'shield', nextLabel: 'Submit',
      description: 'Your account is verified and ready to launch campaigns.',
    },
  ];

  get steps(): OnboardingStep[] {
    return this.stepDefs.map(s => ({
      ...s,
      status: s.number < this.currentStep ? 'completed'
            : s.number === this.currentStep ? 'active'
            : 'pending',
    }));
  }

  get activeStep(): (typeof this.stepDefs)[0] {
    return this.stepDefs[this.currentStep - 1];
  }

  get progressPercent(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  get nextButtonLabel(): string {
    return this.activeStep.nextLabel;
  }

  get isEditInfoStep(): boolean {
    return this.currentStep === 3;
  }

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.advertiserForm = this.fb.group({
      advertiserName:     ['', Validators.required],
      businessType:       ['', Validators.required],
      industry:           ['', Validators.required],
      companyWebsite:     ['', Validators.required],
      businessEmail:      ['', [Validators.required, Validators.email]],
      phoneNumber:        ['', Validators.required],
      country:            ['', Validators.required],
      stateRegion:        ['', Validators.required],
      businessAddress:    ['', Validators.required],
      companyDescription: ['', Validators.required],
      taxId:              ['', Validators.required],
    });
  }

  onDocumentsChanged(docs: UploadedDoc[]): void {
    this.uploadedDocs = docs;
    this.cdr.markForCheck();
  }

  editInfo(): void {
    this.currentStep = 1;
    this.cdr.markForCheck();
  }

  back(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.cdr.markForCheck();
    }
  }

  next(): void {
    if (this.currentStep === 1) {
      this.advertiserForm.markAllAsTouched();
      if (!this.advertiserForm.valid) {
        this.cdr.markForCheck();
        return;
      }
    }
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.cdr.markForCheck();
    }
  }

  saveDraft(): void {
    // Persist draft state — hook to service when backend is ready
  }
}
