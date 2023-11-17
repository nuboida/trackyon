import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CallMemoService } from '@app/services/call-memo.service';
import { MemoTaskDetailsResponse, MemoTaskStaffDetailsResponse } from '@modules/call-memo/models/call-memo-response.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CreateAppraisalComponent } from '../components/create-appraisal/create-appraisal.component';

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
  currentAppraisals!: MemoTaskDetailsResponse;
  memoTaskId!: string;
  staffId!: string;
  memoTaskDetails!: MemoTaskStaffDetailsResponse[];
  weight!: number;
  constructor(
   private route: ActivatedRoute,
   private memoService: CallMemoService,
   private dialog: MatDialog,
   private router: Router
    ) {
    this.memoTaskId = this.route.snapshot.paramMap.get("id");
    this.staffId = this.route.snapshot.paramMap.get("staffId");
  }

  ngOnInit() {
    this.memoTaskDetails = this.data.data.filter((task: any) => task.memoTaskId === Number(this.memoTaskId));
    this.memoService.getTaskByStaff(this.staffId).pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.currentPage = data.filter((task) => task.memoTaskId === Number(this.memoTaskId))[0].name;
          this.weight = data.filter((task) => task.memoTaskId === Number(this.memoTaskId))[0].weight;
        }
      );
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
          window.location.reload();
        }
      })
    } else {
      const dialogRef = this.dialog.open(CreateAppraisalComponent, {
        panelClass: "custom-dialog-container",
      });
      dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
        if (result) {
          window.location.reload();
        }
      })
    }
  }

}
