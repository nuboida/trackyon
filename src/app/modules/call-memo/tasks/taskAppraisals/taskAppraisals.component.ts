import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CallMemoService } from '@app/services/call-memo.service';
import { CallMemoService as AppraisalService } from "@modules/call-memo/services/call-memo.service"
import { MemoTaskStaffDetailsResponse } from '@modules/call-memo/models/call-memo-response.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CreateAppraisalComponent } from '../components/create-appraisal/create-appraisal.component';
import { ErrorResponse } from '@app/models/error.model';
import { HotToastService } from '@ngneat/hot-toast';
import { formatAPIDate } from '@app/helpers/date.helper';
import { CallStaffMemoDetailFilterRequest } from '@modules/call-memo/models/call-memo-request.model';

@UntilDestroy()
@Component({
  selector: 'olla-taskAppraisals',
  templateUrl: './taskAppraisals.component.html'
})
export class TaskAppraisalsComponent implements OnInit {
  currentPage = " ";
  returnRoute = "/memo/tasks";
  toolTip = "Back to Tasks";
  data = this.route.snapshot.data;
  memoTaskId!: string;
  staffId!: string;
  memoTaskDetails!: MemoTaskStaffDetailsResponse[];
  weight!: number;
  loading = false;
  filter:CallStaffMemoDetailFilterRequest = {
    staffId: this.staffId,
    startTime: new Date(),
    endTime: new Date()
  }
  constructor(
   private route: ActivatedRoute,
   private memoService: CallMemoService,
   private appraisalService: AppraisalService,
   private dialog: MatDialog,
   private toast: HotToastService
    ) {
    this.memoTaskId = this.route.snapshot.paramMap.get("id")!;
    this.staffId = this.route.snapshot.paramMap.get("staffId")!;
  }

  ngOnInit() {
    // this.memoTaskDetails = this.data.data.filter((task: any) => task.memoTaskId === Number(this.memoTaskId));
    this.getStaffTaskByDate();

    this.memoService.getTaskByStaff(this.staffId).pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.currentPage = data.filter((task) => task.memoTaskId === Number(this.memoTaskId))[0].name;
          this.weight = data.filter((task) => task.memoTaskId === Number(this.memoTaskId))[0].weight;
        }
      );
  }

  getStaffTaskByDate(staffId = this.data['data'].staff, startTime = this.data['data'].startDate, endTime = this.data['data'].endDate): void {
    this.loading = true;
    this.appraisalService.getMemoTaskStaffDetails({staffId, startTime, endTime})
    .pipe(untilDestroyed(this)).subscribe(
      (data) => {
        this.memoTaskDetails = data.filter((task: any) => task.memoTaskId === Number(this.memoTaskId));
        this.loading = false;
      },
      (err: ErrorResponse) => {
        this.toast.error(err.message);
        this.loading = false;
      }
    )
  }

  filterTaskByDate(): void {
    if (this.filter.startTime === null || this.filter.endTime === null) {
      this.toast.warning("Enter valid date range");
      return;
    }
    this.filter = {
      ...this.filter,
      startTime: formatAPIDate(new Date(this.filter.startTime)).split('T')[0],
      endTime: formatAPIDate(new Date(this.filter.endTime)).split('T')[0],
    }
    this.getStaffTaskByDate(this.staffId, this.filter.startTime, this.filter.endTime);
  }

  openDialog(details?: MemoTaskStaffDetailsResponse, note?: boolean, appraise?: boolean, weight = this.weight, staffId = this.staffId, memoTaskId = this.memoTaskId ): void {
    if (note || appraise) {
      const dialogRef = this.dialog.open(CreateAppraisalComponent, {
        panelClass: "custom-dialog-container",
        data: {
          details,
          note,
          appraise,
          weight,
          staffId,
          memoTaskId
        }
      });
      dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
        if (result) {
          this.getStaffTaskByDate()
        }
      })
    } else {
      const dialogRef = this.dialog.open(CreateAppraisalComponent, {
        panelClass: "custom-dialog-container",
      });
      dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
        if (result) {
          this.getStaffTaskByDate()
        }
      })
    }
  }

}
