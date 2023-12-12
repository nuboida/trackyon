import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorResponse } from '@app/models/error.model';
import { MemoTaskDetailsResponse } from '@modules/call-memo/models/call-memo-response.model';
import { CallMemoService } from '@modules/call-memo/services/call-memo.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-createDeptAppraisal',
  templateUrl: './createDeptAppraisal.component.html',
  styleUrls: ['./createDeptAppraisal.component.scss']
})
export class CreateDeptAppraisalComponent implements OnInit {

  currentPage = "Note / Appraisal"
  detailForm!: FormGroup;
  loading = false;
  editMode = false;
  scoreOptions = scoreFilters;
  newNote = false;
  newAppraisal = false;
  editNote = false;
  editAppraisal = false;
  constructor(
    private fb: FormBuilder,
    private callMemoService: CallMemoService,
    private toast: HotToastService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: {
      details: MemoTaskDetailsResponse,
      note: boolean,
      appraise: boolean,
      weight: number,
      deptId: string,
      memoTaskId: number
    }
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(): void {
    if (!this.data.details) {
      this.detailForm = this.fb.group({
        detailsDate: [''],
        notes: [''],
        score: [9],
        comment: [''],
        scoreDate: [''],
      })
    } else {
      this.detailForm = this.fb.group({
        detailsDate: [{value: this.data.details.detailsDate, disabled: true}],
        notes: [this.data.details.notes],
        score: [this.data.details.score],
        comment: [this.data.details.comment],
        scoreDate: this.data.details.scoreDate.includes("0001") ? new Date() : this.data.details.scoreDate
      })
    }
  }

  handleCancel(): void {
    this.dialogRef.close()
  }

  handleSaveNote(): void {
    const request = {
      detailsDate: this.detailForm.controls["detailsDate"].value as string,
      notes: this.detailForm.controls["notes"].value as string,
      score: this.detailForm.controls["score"].value as number,
      comment: this.detailForm.controls["comment"].value as string,
      departmentId: Number(this.data.deptId),
      memoTaskId: Number(this.data.memoTaskId),
      companyId: '',
      weight: this.data.weight
    }
    if (!this.data.details && !this.editNote) {
      this.callMemoService.addTaskDetail(request).pipe(untilDestroyed(this))
        .subscribe(
          () => {
            this.toast.success("Note added")
            this.loading = false;
            this.dialogRef.close(true);
          },
          (err: ErrorResponse) => {
            this.toast.error(err.message);
            this.loading = false;
            this.dialogRef.close();
          }
        )
    } else if (this.data && this.editNote) {
      const request = {
        id: this.data.details.id,
        score: this.detailForm.controls["score"].value,
        comment: this.detailForm.controls["comment"].value,
        notes: this.detailForm.controls["notes"].value,
        weight: this.data.weight,
      }
      this.callMemoService.editTaskDetails(request).pipe(untilDestroyed(this))
        .subscribe(
          () => {
            this.toast.success("Note Updated Successfully");
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
  }

  handleSaveAppraisal(): void {
    this.loading = true;
    const request = {
      id: this.data.details.id,
      scoreDate: this.detailForm.controls["scoreDate"].value,
      score: this.detailForm.controls["score"].value,
      weight: this.data.weight,
      comment: this.detailForm.controls["comment"].value
    }
    this.callMemoService.addAppraisal(request).pipe(untilDestroyed(this))
    .subscribe(
      res => {
        this.toast.success(res.message);
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

  handleDelete(): void {
    this.loading = true;
    this.callMemoService.deleteAppraisal(this.data.details.id).pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.toast.success("Successfully deleted");
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

  toggleEditNote(): void {
    this.editNote ? this.editNote = false : this.editNote = true;
    this.editAppraisal = false;
  }

  handleCancelNote(): void {
    this.editNote = false;
    this.editAppraisal = false;
  }

  toggleEditAppraisal(): void {
    this.editAppraisal ? this.editAppraisal = false : this.editAppraisal = true;
    this.editNote = false;
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
  { name: 'Not Applicable', value: 9 },
]
