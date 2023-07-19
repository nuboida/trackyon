import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityCreateRequest } from '@app/models/opportunity.model';
import { getActivity, getActivityMessage, State } from '@modules/opportunity/state';
import { clearActivity, createActivity, loadActivity, updateActivity } from '@modules/opportunity/state/actions/opportunity-item-page.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'olla-activity-create',
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.scss']
})
export class ActivityCreateComponent implements OnInit {

  loading = false;
  form!: FormGroup;
  min = new Date();
  data: ActivityCreateRequest = {
    nextAction: '',
    staffId: '',
    isClosed: false,
    opportunityStageId: 0,
    companyId: '',
    opportunityId: '',
    dateCreated: this.min,
    proposedDate: this.min
  };
  currentPage = this.editMode ? 'Update Activity' : 'New Activity';
  constructor(public dialogRef: MatDialogRef<ActivityCreateComponent>, private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public info: {opportunityId: string, salesStageId: number, activityId: number},
              private store: Store<State>) {
      this.data.opportunityId = info.opportunityId;
      this.data.opportunityStageId = info.salesStageId;
    }

  ngOnInit(): void {

    this.form = this.fb.group({
      nextAction: [this.data.nextAction, Validators.required],
      proposedDate: [this.data.proposedDate]
    });
    this.store.dispatch(clearActivity());
    this.store.select(getActivity).pipe(untilDestroyed(this)).subscribe(
      data => {
        this.nextCtrl.patchValue(data?.nextAction);
        this.proposedCtrl.patchValue(data?.proposedDate ?? this.data.proposedDate);
      },
    );

    this.store.select(getActivityMessage).pipe(untilDestroyed(this)).subscribe(
      message => {
        if (message === 'Success') {
          this.returnToOpportunity(message);
        } else {
        this.loading = false;
        }
      },
    );

    if (this.info.activityId) {
      this.store.dispatch(loadActivity({
        opportunityId: this.info.opportunityId,
        activityId: this.info.activityId
      }));
    }

  }

  get editMode(): boolean {
    return this.info.activityId > 0;
  }

  get nextCtrl(): FormControl {
    return this.form.get('nextAction') as FormControl;
  }

  get proposedCtrl(): FormControl {
    return this.form.get('proposedDate') as FormControl;
  }

  returnToOpportunity(value?: string): void {
    this.dialogRef.close(value);
  }

  submitActivity(): void {
    this.loading = true;
    const request = {...this.data, ...this.form.value} as ActivityCreateRequest;

    if (this.editMode) {
      const date = new Date(request.proposedDate);
      this.store.dispatch(updateActivity({
        activityId: this.info.activityId, date, nextAction: request.nextAction
      }));
    }

    if (!this.editMode) {
      this.store.dispatch(createActivity({request}));
    }
  }

}
