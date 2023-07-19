import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorResponse } from '@app/models/error.model';
import { Stage, StageUpdateRequest } from '@app/models/opportunity.model';
import { OpportunityService } from '@app/services/opportunity.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-stage-update',
  templateUrl: './stage-update.component.html',
  styleUrls: ['./stage-update.component.scss']
})
export class StageUpdateComponent implements OnInit {

  loading = false;
  stages$!: Observable<Stage[]>;
  form!: FormGroup;

  data: StageUpdateRequest = {
    opportunityId: '',
    opportunityStageId: 0,
  };

  constructor(public dialogRef: MatDialogRef<StageUpdateComponent>, private fb: FormBuilder,
              private opportunityService: OpportunityService, private toast: HotToastService,
              @Inject(MAT_DIALOG_DATA) public info: {opportunityId: string}) {
      this.data.opportunityId = info.opportunityId;
    }

  ngOnInit(): void {
    this.getOptions();
    this.initializeForm();
    this.getOpportunity();
  }

  getOptions(): void {
    this.stages$ = this.opportunityService.getStages();
  }

  getOpportunity(): void {
    this.opportunityService.getOpportunity(this.info.opportunityId)
    .pipe(untilDestroyed(this))
    .subscribe(
      data => this.f.opportunityStageId.patchValue(data.stageId),
      () => this.toast.error('Error Retrieving Opportunity')
    );
  }

  initializeForm(): void {
    this.form = this.fb.group({
      opportunityStageId: [this.data.opportunityStageId, [Validators.required, Validators.min(1)]],
    });
  }

  get f(): any { return this.form.controls; }

  returnToOpportunity(value?: string): void {
    this.dialogRef.close(value);
  }


  updateStage(): void {
    this.loading = true;
    const request = {...this.data, ...this.form.value} as StageUpdateRequest;

    this.opportunityService.updateStage(request).pipe(untilDestroyed(this))
    .subscribe(
      () => {
        this.toast.success('Stage Updated');
        this.returnToOpportunity('Success');
      },
      (err: ErrorResponse) => {
        this.toast.error(err.message);
        this.loading = false;
      }
    );
  }

}
