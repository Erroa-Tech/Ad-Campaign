import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WizardStep, WizardStepStatus } from '../../models/business-ad.models';
import { CampaignDetailsStepComponent } from './steps/campaign-details-step.component';
import { CreativeUploadStepComponent } from './steps/creative-upload-step.component';
import { PlacementStepComponent } from './steps/placement-step.component';
import { PlacementPreviewComponent } from './steps/placement-preview.component';
import { AudienceStepComponent } from './steps/audience-step.component';
import { BudgetDurationStepComponent } from './steps/budget-duration-step.component';
import { ReviewSubmitStepComponent } from './steps/review-submit-step.component';

@Component({
  selector: 'app-create-campaign',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CampaignDetailsStepComponent, CreativeUploadStepComponent, PlacementStepComponent, PlacementPreviewComponent, AudienceStepComponent, BudgetDurationStepComponent, ReviewSubmitStepComponent],
  templateUrl: './create-campaign.page.html',
  styleUrl: './create-campaign.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCampaignPageComponent {
  currentStep = 1;
  readonly totalSteps = 6;
  selectedPlacementId = '';
  submitted = false;

  readonly steps: WizardStep[] = [
    { number: 1, label: 'Campaign Details',   title: 'Campaign Details',   subtitle: 'Set the goals and basic details for your campaign.' },
    { number: 2, label: 'Creative Upload',    title: 'Creative Upload',    subtitle: 'Upload the image or video that will appear in your ad.' },
    { number: 3, label: 'Placement',          title: 'Placement',          subtitle: 'Choose where your ad appears in the app.' },
    { number: 4, label: 'Audience',           title: 'Audience',           subtitle: 'Define who will see your ad.' },
    { number: 5, label: 'Budget & Duration',  title: 'Budget & Duration',  subtitle: 'Set your daily budget and campaign schedule.' },
    { number: 6, label: 'Review & Submit',    title: 'Review & Submit',    subtitle: 'Review everything before submitting for approval.' },
  ];

  readonly campaignForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.campaignForm = this.fb.group({
      details: this.fb.group({
        campaignName: ['', Validators.required],
        objective:    ['', Validators.required],
        category:     ['', Validators.required],
        description:  ['', Validators.maxLength(280)],
      }),
      creative: this.fb.group({
        mediaType: ['image'],
        file:      [null, Validators.required],
      }),
      placement: this.fb.group({
        placementId: ['', Validators.required],
      }),
      audience: this.fb.group({
        gender:    ['all'],
        ageMin:    [13],
        ageMax:    [65],
        countries: [[]],
        states:    [[]],
        cities:    [[]],
        pinCodes:  [[]],
      }),
      budget: this.fb.group({
        dailyBudget:    ['', Validators.required],
        totalBudgetCap: [''],
        startDate:      ['', Validators.required],
        endDate:        ['', Validators.required],
      }),
    });
  }

  get currentStepGroup(): FormGroup | null {
    switch (this.currentStep) {
      case 1: return this.detailsGroup;
      case 2: return this.creativeGroup;
      case 3: return this.placementGroup;
      case 5: return this.budgetGroup;
      default: return null; // steps 4 (audience) and 6 (review) have no required fields
    }
  }

  get detailsGroup(): FormGroup {
    return this.campaignForm.get('details') as FormGroup;
  }

  get creativeGroup(): FormGroup {
    return this.campaignForm.get('creative') as FormGroup;
  }

  get placementGroup(): FormGroup {
    return this.campaignForm.get('placement') as FormGroup;
  }

  get audienceGroup(): FormGroup {
    return this.campaignForm.get('audience') as FormGroup;
  }

  get budgetGroup(): FormGroup {
    return this.campaignForm.get('budget') as FormGroup;
  }

  get activeStep(): WizardStep {
    return this.steps[this.currentStep - 1];
  }

  stepStatus(n: number): WizardStepStatus {
    if (n < this.currentStep) return 'completed';
    if (n === this.currentStep) return 'active';
    return 'pending';
  }

  goNext(): void {
    if (this.currentStep >= this.totalSteps) return;
    const group = this.currentStepGroup;
    if (group?.invalid) {
      this.submitted = true;
      group.markAllAsTouched();
      return;
    }
    this.submitted = false;
    this.currentStep++;
  }

  goBack(): void {
    if (this.currentStep > 1) {
      this.submitted = false;
      this.currentStep--;
    }
  }

  onPlacementSelected(id: string): void {
    this.selectedPlacementId = id;
  }
}
