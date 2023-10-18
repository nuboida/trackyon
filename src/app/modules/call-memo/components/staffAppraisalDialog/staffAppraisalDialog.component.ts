import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatAPIDate } from '@app/helpers/date.helper';
import { ErrorResponse } from '@app/models/error.model';
import { UpdateScoreRequest } from '@modules/call-memo/models/call-memo-response.model';
import { CallMemoService } from '@modules/call-memo/services/call-memo.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-staffappraisalDialog',
  templateUrl: './staffAppraisalDialog.component.html',
  styleUrls: ['./staffAppraisalDialog.component.scss']
})
export class StaffAppraisalDialogComponent implements OnInit {

  currentPage = this.data.taskName;
  appraisalForm!: FormGroup;
  appraisalData: UpdateScoreRequest = {
    id: this.data.taskDetailId,
    scoreDate: formatAPIDate(new Date()),
    score: this.data.taskScore || 9,
    weight: this.data.taskWeight,
    comment: this.data.taskComment
  };
  loading = false;
  scoreOptions = scoreFilters

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {taskName: string, taskWeight: number, taskDetailId: number, taskScore: number, taskComment: string },
    public dialogRef: MatDialogRef<StaffAppraisalDialogComponent>,
    private toast: HotToastService,
    private callMemoService: CallMemoService
  ) { }

  ngOnInit() {

  }

  saveAppraisal(): void {
    this.loading = true;
    const request = {
      ...this.appraisalData,
    }

    this.callMemoService.addAppraisal(request).pipe(untilDestroyed(this))
      .subscribe(
        (res) => {
          this.toast.success(res.message)
          this.loading = false;
          this.dialogRef.close(true);
        },
        (err: ErrorResponse) => {
          this.toast.error("First create a note");
          this.loading = false;
          this.dialogRef.close();
        }
      )
  }

  deleteAppraisal(): void {
    this.loading = true;

    this.callMemoService.deleteAppraisal(this.data.taskDetailId).pipe(untilDestroyed(this))
      .subscribe(
        res => {
          this.toast.success('Successfully deleted')
          this.loading = false;
          this.dialogRef.close(true);
        },
        (err: ErrorResponse) => {
          this.toast.error(err.message);
          this.loading = false;
          this.dialogRef.close();
        }
      )
  }

  handleCancel(): void {
    this.dialogRef.close();
  }
}
interface Option {
  name: string;
  value: number;
}

const scoreFilters: Option[] = [
  { name: '0', value: 0 },
  { name: '1', value: 1 },
  { name: '2', value: 2 },
  { name: '3', value: 3 },
  { name: '9', value: 9 },
]
