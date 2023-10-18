import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatAPIDate } from '@app/helpers/date.helper';
import { ErrorResponse } from '@app/models/error.model';
import { EditTaskDetailRequest, MemoTaskDetailRequest, MemoTaskStaffDetailRequest } from '@modules/call-memo/models/call-memo-response.model';
import { CallMemoService } from '@modules/call-memo/services/call-memo.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'olla-staff-memo-edit',
  templateUrl: './staff-memo-edit.component.html',
  styleUrls: ['./staff-memo-edit.component.scss']
})
export class StaffMemoEditComponent implements OnInit {

  currentPage = this.data.taskName;
  detailForm!: FormGroup;
  loading = false;
  editMode = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {taskId: number, taskName: string, staffId: string, taskDetailId: string, taskDate: string, taskNotes: string, taskScore: number, taskComment: number},
    public dialogRef: MatDialogRef<StaffMemoEditComponent>,
    public fb: FormBuilder,
    private callMemoService: CallMemoService,
    private toast: HotToastService
  ) { }

  ngOnInit() {
    this.initializeForm();
    if (this.data.taskDetailId) {
      this.editMode = true;
    }
  }

  initializeForm(): void {
    this.detailForm = this.fb.group({
      detailsDate: [this.data.taskDate ? formatAPIDate(new Date(this.data.taskDate)) :formatAPIDate(new Date())],
      notes: [this.data.taskNotes],
      score: [this.data.taskScore || 0],
      comment: [this.data.taskComment]
    })
  }

  submitTaskDetails(): void {
    this.loading = true;

    if (!this.editMode) {
      const request: MemoTaskDetailRequest = {
       ...this.detailForm.value,
       staffId: this.data.staffId,
       memoTaskId: this.data.taskId
      }
      this.callMemoService.addTaskDetail(request).pipe(untilDestroyed(this))
       .subscribe(
         () => {
           this.toast.success('Comment added')
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

    if (this.editMode) {
      const request: EditTaskDetailRequest = {
        ...this.detailForm.value,
        id: this.data.taskDetailId
      }

      this.callMemoService.editTaskDetails(request).pipe(untilDestroyed(this))
        .subscribe(
          () => {
            this.toast.success('Details updated')
            this.loading = false
            this.dialogRef.close(true)
          },
          (err: ErrorResponse) => {
            this.toast.error(err.message);
            this.loading = false;
            this.dialogRef.close();
          }
        )
    }
  }

  handleCancel(): void {
    this.dialogRef.close();
  }

}
