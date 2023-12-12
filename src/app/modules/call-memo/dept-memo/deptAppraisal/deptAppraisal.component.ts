import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CallDeptMemoFilterRequest, CallStaffMemoDetailFilterRequest } from '@modules/call-memo/models/call-memo-request.model';
import { MemoTaskDetailsResponse, MemoTaskStaffDetailsResponse } from '@modules/call-memo/models/call-memo-response.model';
import { HotToastService } from '@ngneat/hot-toast';
import { CallMemoService } from '@app/services/call-memo.service';
import { CallMemoService as AppraisalService } from "@modules/call-memo/services/call-memo.service"
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ErrorResponse } from '@app/models/error.model';
import { formatAPIDate } from '@app/helpers/date.helper';
import { CreateDeptAppraisalComponent } from '../createDeptAppraisal/createDeptAppraisal.component';


@UntilDestroy()
@Component({
  selector: 'olla-deptAppraisal',
  templateUrl: './deptAppraisal.component.html',
})
export class DeptAppraisalComponent implements OnInit {
  currentPage = " ";
  returnRoute = "/memo/department";
  toolTip = "Back To Tasks";
  data = this.route.snapshot.data;
  memoTaskId!: string;
  deptId!: string;
  memoTaskDetails!: MemoTaskDetailsResponse[];
  weight!: number;
  loading = false;
  filter: CallDeptMemoFilterRequest = {
    departmentId: this.deptId,
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
    this.deptId = this.route.snapshot.paramMap.get("deptId")!;
   }

  ngOnInit() {
    this.getTaskByDate();
    this.memoService.getTasks(this.deptId).pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.currentPage = data.filter((task) => task.memoTaskId === Number(this.memoTaskId))[0].name;
          this.weight = data.filter((task) => task.memoTaskId === Number(this.memoTaskId))[0].weight;
        }
      );
  }

  getTaskByDate(departmentId = this.data['data'].deptId, startTime = this.data['data'].startDate, endTime = this.data['data'].endDate): void {
    this.loading = true;
    this.appraisalService.getMemoTaskDetails({departmentId, startTime, endTime})
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
    this.getTaskByDate(this.deptId, this.filter.startTime, this.filter.endTime);
  }

  openDialog(details?: MemoTaskDetailsResponse, note?: boolean, appraise?: boolean, weight = this.weight, deptId = this.deptId, memoTaskId = this.memoTaskId ): void {
    if (note || appraise) {
      const dialogRef = this.dialog.open(CreateDeptAppraisalComponent, {
        panelClass: "custom-dialog-container",
        data: {
          details,
          note,
          appraise,
          weight,
          deptId,
          memoTaskId
        }
      });
      dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
        if (result) {
          this.getTaskByDate()
        }
      })
    } else {
      const dialogRef = this.dialog.open(CreateDeptAppraisalComponent, {
        panelClass: "custom-dialog-container",
        data: {
          details,
          note,
          appraise,
          weight,
          deptId,
          memoTaskId
        }
      });
      dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
        if (result) {
          this.getTaskByDate()
        }
      })
    }
  }

}
