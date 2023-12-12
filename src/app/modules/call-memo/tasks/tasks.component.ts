import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CallStaffMemoDetailFilterRequest, TaskDeptMemoFilterRequest } from '../models/call-memo-request.model';
import { Observable } from 'rxjs';
import { StaffResponse } from '@app/models/staff.model';
import { StaffService } from '@app/services/staff.service';
import { FormControl } from '@angular/forms';
import { CallMemoService } from '@app/services/call-memo.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatTableDataSource } from '@angular/material/table';
import { TaskResponse } from '@app/models/call-memo.model';
import { HotToastService } from '@ngneat/hot-toast';
import { MatPaginator } from '@angular/material/paginator';
import { formatAPIDate } from '@app/helpers/date.helper';
import { Store } from '@ngrx/store';
import { State, getMemoTaskStaffDetails } from '../state';
import { loadMemoTaskStaffDetails } from '../state/actions/call-memo-page.actions';
import { MemoTaskStaffDetailsResponse } from '../models/call-memo-response.model';
import { MatDialog } from '@angular/material/dialog';
import { StaffMemoEditComponent } from '../components/staff-memo-edit/staff-memo-edit.component';
import { StaffAppraisalDialogComponent } from '../components/staffAppraisalDialog/staffAppraisalDialog.component';
import { ExcelService } from '@app/services/excel.service';
import { ExcelRequest } from '@app/models/excel.model';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'olla-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit, AfterViewInit {
  currentPage = 'Tasks Call Memo';
  displayCoreColumns: string[] = ['position', 'task', 'weight'];
  displayedColumns: string[] = ['position', 'task', 'weight'];
  toolTip = 'Actions';
  filter: TaskDeptMemoFilterRequest = {
    staffId: '',
    startTime: formatAPIDate(new Date()).split('T')[0],
    endTime: formatAPIDate(new Date()).split('T')[0]
  };

  dataSource = new MatTableDataSource<TaskResponse>([]);
  kpiDataSource = new MatTableDataSource<TaskResponse>([]);
  coreDataSource = new MatTableDataSource<TaskResponse>([]);
  staff$!: Observable<StaffResponse[]>;
  activeStaffs: StaffResponse[] = [];
  staffOptions: any[] = [];
  staffTask: FormControl = new FormControl('');
  memoTaskDetails: MemoTaskStaffDetailsResponse[] = [];
  selectedStaff!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private staffService: StaffService,
    private memoService: CallMemoService,
    private toast: HotToastService,
    private store: Store<State>,
    private dialog: MatDialog,
    private excel: ExcelService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.staffService.getStaffs().pipe(untilDestroyed(this)).subscribe((staff) => {
      this.activeStaffs = staff.filter((data) => data.active);
    });
    this.store.select(getMemoTaskStaffDetails).pipe(untilDestroyed(this)).subscribe(
      x => {
        this.memoTaskDetails = x;
      }
    );

    this.staffTask.valueChanges.pipe(untilDestroyed(this))
      .subscribe(() => {
        this.staffOptions.forEach((c) => {
          if (c.staffId === this.staffTask.value) {
            this.selectedStaff = c.staffName;
          }
        })
      });
  }

  ngAfterViewInit(): void {
    this.kpiDataSource.paginator = this.paginator;
  }

  filterMemos(): void {
    if (this.filter.startTime === null || this.filter.endTime === null) {
      this.toast.warning('Enter a valid date range');
      return;
    }

    this.filter = {
      staffId: this.staffTask.value,
      startTime: formatAPIDate(new Date(this.filter.startTime)).split('T')[0],
      endTime: formatAPIDate(new Date(this.filter.endTime)).split('T')[0],
    }
    this.store.dispatch(loadMemoTaskStaffDetails({ request: { ...this.filter }}));
  }

  getTasks(dept: string): void {
    this.memoService.getTasks(dept).pipe(untilDestroyed(this)).subscribe(
      data => {
        this.dataSource.data = data;
        this.coreDataSource.data = data.filter((task) => task.criteria === 'core');
        this.kpiDataSource.data = this.dataSource.data.filter((task) => task.criteria !== 'core' && task.name !== 'x');
      },
      () => this.toast.error('Error retrieving Tasks'),
    )
  }

  getStaffTask(): void {
    this.memoService.getTaskByStaff(this.staffTask.value).pipe(untilDestroyed(this)).subscribe(
      data => {
        this.dataSource.data = data;
        this.coreDataSource.data = data.filter((task) => task.criteria === 'core');
        this.kpiDataSource.data = this.dataSource.data.filter((task) => task.criteria !== 'core' && task.name !== 'x');
      },
      () => this.toast.error('Error retrieving Tasks'),
    )
  }

  getTaskStaffDate(memoDetailTask: number): string {
    const taskDate = this.memoTaskDetails.filter(x => {
      x.memoTaskId === memoDetailTask
    })[0]?.scoreDate;
    if (taskDate && new Date(taskDate).getFullYear() !== 1000) {
      return taskDate;
    }
    return '';

  }

  getTaskNote(memoDetailTask: number): string {
    const taskNote = this.memoTaskDetails.filter(x => x.memoTaskId === memoDetailTask)[0]?.notes
    if (taskNote) {
      return taskNote
    }
    return ' ';
  }

  getTaskScore(memoDetailTask: number): number {
    const taskScore = this.memoTaskDetails.filter(x => x.memoTaskId === memoDetailTask)[0]?.score
    if (this.memoTaskDetails.length || taskScore) {
      return taskScore
    }
    return 9;
  }

  getTaskComment(memoDetailTask: number): string {
   const taskComment = this.memoTaskDetails.filter(x => x.memoTaskId === memoDetailTask)[0]?.comment;
   if (taskComment){
    return taskComment;
   }
   return ' ';
  }

  getTaskCriteria(memoDetailTask: number): string {
    const taskCriteria = this.dataSource.data.filter(x => x.memoTaskId === memoDetailTask)[0]?.criteria;
    if (taskCriteria) {
      return taskCriteria;
    }
    return ' ';
  }

  getTaskDetailId(memoDetailTask: number): number {
    const detailId = this.memoTaskDetails.filter(x => x.memoTaskId === memoDetailTask)[0]?.id
    if (this.memoTaskDetails.length || detailId !== 0) {
      return detailId
    }
    return 0
  }

  AddOrEdit(memoDetailTask: number): boolean {
    const taskDetail = this.memoTaskDetails.filter(x => x.memoTaskId === memoDetailTask);
    if (taskDetail.length === 0) {
      return false
    } else {
      return true;
    }
  }

  editTaskDetail(taskId: string, taskName: string, taskDetailId: number, taskDate: string, taskNotes?: string, taskScore?: number, taskComment?: string): void {
    this.openDialog(taskId, taskName, taskDetailId, taskDate, taskNotes, taskScore, taskComment);
  }

  openDialog(taskId?: string, taskName?: string, taskDetailId?: number, taskDate?: string, taskNotes?: string, taskScore?: number, taskComment?: string): void {
    const dialogRef = this.dialog.open(StaffMemoEditComponent, {
      height: '600px',
      width: '600px',
      data: { taskId, taskName, staffId: this.staffTask.value, taskDetailId, taskDate, taskNotes, taskScore, taskComment, }
    });
    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.filterMemos();
      }
    })
  }

  openAppraisalDialog(taskName?: string, taskWeight?: number, taskDetailId?: number, taskScore?: number, taskComment?: string): void {
    const dialogRef = this.dialog.open(StaffAppraisalDialogComponent, {
      height: '600px',
      width: '600px',
      data: { taskName, taskWeight, taskDetailId, taskScore, taskComment }
    });
    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.filterMemos();
      }
    })
  }

  exportExcel(): void {
    const dataDate = this.memoTaskDetails.map((d, i) => {
      const [sn, note, score, scoreDate, comment, weight] = [i + 1, d.notes, d.score, d.scoreDate, d.comment, d.weight];
      const taskName = this.dataSource.data.filter((x) => {
        return x.memoTaskId === d.memoTaskId;
      });

      let scoreDateAr = () => {
        let year = new Date(d.scoreDate).getFullYear();
        if (year === 1000) {
          return ''
        }
        return d.scoreDate
      }
      let criteria = this.getTaskCriteria(d.memoTaskId);
      return {sn, taskName: taskName[0].name.trim(), note, score, scoreDate: scoreDateAr(), comment, weight, wtSum: score === 9 ? 0 : (score * weight)/100, criteria};
    }).sort((a: any, b: any) => {
      const dateA = a.scoreDate ? new Date((a.scoreDate).split("").reverse().join("")) : null;
      const dateB = b.scoreDate ? new Date((b.scoreDate).split("").reverse().join("")) : null;
      if (dateA === dateB) {
        return 0
      }
      if (dateA === null) {return 1}
      if (dateB === null) {return -1};
      return dateB > dateA ? -1 : 1;
    });

    const dataAll = dataDate.map((e, i) => {
      let detailsDate = () => {
        let year = new Date(e.scoreDate).getFullYear();
        let month = (new Date(e.scoreDate).getMonth() + 1);
        let day = new Date(e.scoreDate).getDate();

        if (!day || !month || !year || year === 1000) {
          return ''
        }
        return `${day}-${month}-${year}`;
      };

      /* if (e.score !== 9) {
        this.currentArr.push(e.score);
        this.expectedArr.push(e.weight);
      } */

      return {
        ...e,
        sn: i + 1,
        scoreDate: detailsDate(),
        score: e.score === 9 ? 'N': e.score
      }
    });

    function groupBy(collection: any, property: string) {
      let values: any[] = [];
      let result: any[] = [];
      let val;
      let index;

      for (let i = 0; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);

        if (collection[i].taskName !== 'x') {
          if (index > -1){
            result[index].push(collection[i]);
          } else {
            values.push(val);
            result.push([collection[i]]);
          }
        }
      }
      return result;
    }

    let groupData = groupBy(dataAll, 'taskName');

    let data = groupData.map((taskObj, i) => {
      let allNotes: string[] = [];
      let allDates: string[] = [];
      let allComments: string[] = [];
      let allScore: any = [];
      let allWeight: number[] = [];
      let itemGroup = taskObj.reduce((a: any, c: any) => {
        allNotes.push(c.note);
        allDates.push(c.scoreDate);
        allComments.push(c.comment);
        allScore.push(c.score);
        allWeight.push(c.weight);

        let dataResult: DataResult = {
          sn: i + 1,
          taskName: c.taskName,
          criteria: c.criteria,
          note: allNotes.join(", ").trim(),
          score: allScore.join(", ").trim(),
          scoreAverage: 0,
          possibleScore: 3,
          scoreDate: allDates.join(", ").trim(),
          comment: allComments.join(", ").trim(),
          weight: 0,
          wtSum: 0,
          possibleWtSum: 0
        }

        let filterScore = allScore.filter((scoreNumber: any) => typeof scoreNumber === 'number' && isFinite(scoreNumber));
        let everyElementANum = allScore.every((scoreNumber: any) => typeof scoreNumber === 'string');
        if (everyElementANum) {
          dataResult.possibleScore = 'N';
        }
        const sum = filterScore.reduce((a: number, b: number) => a + b, 0);
        let weightScore = allWeight.filter((scoreWeight) => typeof scoreWeight === 'number' && isFinite(scoreWeight) && scoreWeight !== 0);
        const sumWeight = weightScore.reduce((a: number, b: number) => a + b, 0);
        dataResult.scoreAverage = filterScore.length || !everyElementANum ? Number((sum / filterScore.length).toFixed(2)) : 'N';
        dataResult.weight = weightScore.length ? Number((sumWeight / weightScore.length).toFixed(2)) : 0;
        dataResult.wtSum = typeof dataResult.scoreAverage === 'number' ? (dataResult.scoreAverage * dataResult.weight) : 0;
        dataResult.possibleWtSum = typeof dataResult.possibleScore === 'number' ? (dataResult.possibleScore * dataResult.weight) : 0;

        return dataResult;
      }, {sn: i + 1, weight: 0, score: 0});
      /* let groupItem = {sn: i + 1, weight: c.weight}
      itemGroup.push(groupItem); */
      return itemGroup;
    });

    let kpiWtSum: number[] = [];
    let totalKpiWtSum: number[] = [];
    let coreWtSum: number[] = [];
    let totalCoreWtSum: number[] = [];

    data.forEach((c) => {
      if (c.criteria === 'kpi') {
        kpiWtSum.push(c.wtSum);
        totalKpiWtSum.push(c.possibleWtSum);
      } else if (c.criteria === 'core') {
        coreWtSum.push(c.wtSum);
        totalCoreWtSum.push(c.possibleWtSum);
      }
    });

    const calcTotal = {
      currentTotal: kpiWtSum.reduce((a, n) => a + n, 0),
      totalWtScore: totalKpiWtSum.reduce((a, n) => a + n, 0),
      expectedTotal: coreWtSum.reduce((a, n) => a + n, 0),
      coreWtSumTotal: totalCoreWtSum.reduce((a, n) => a + n, 0)
    }

    const overallKpi = ((calcTotal.currentTotal/calcTotal.totalWtScore)*100).toFixed(2);
    const overallCore = ((calcTotal.expectedTotal/calcTotal.coreWtSumTotal)*100).toFixed(2);

    const request: ExcelRequest<any> = {
      data,
      title: `Staff Task Memo`,
      headers: [
        'S/No', 'Tasks', 'Criteria', 'Notes', 'Score', 'Average Score', 'Max Score', 'Appraised Date', "MD's Comment", "Weight", "Wt.X.Score", "Probable Wt.X.Score"
      ],
      deptMemo: `${this.selectedStaff}`,
      totalWtScore: calcTotal.currentTotal,
      totalCoreWtSum: calcTotal.coreWtSumTotal,
      possibleWtScore: calcTotal.totalWtScore,
      possibleCoreWtScore: calcTotal.expectedTotal,
      kpiTotal: `${overallKpi}`,
      coreTotal: `${overallCore}`,
      percentageTotal: `${((Number(overallKpi)*0.9) + Number(overallCore)*0.1).toFixed(2)}%`,
      startDate: ((this.filter.startTime).toString()).split("-").reverse().join("/"),
      endDate: ((this.filter.endTime).toString()).split("-").reverse().join("/"),
    }

    this.excel.exportDeptMemoExcel(request, 'staff');

  }

}

interface DataResult {
  sn: number;
  taskName: string;
  comment: string;
  criteria: string;
  note: string;
  possibleScore: string | number;
  score: string;
  scoreAverage: string | number;
  scoreDate: string;
  weight: number;
  wtSum: number;
  possibleWtSum: number;
}
