import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { formatAPIDate } from '@app/helpers/date.helper';
import { DepartmentResponse } from '@app/models/department.model';
import { ExcelRequest } from '@app/models/excel.model';
import { CallMemoService } from '@app/services/call-memo.service';
import { DepartmentService } from '@app/services/department.service';
import { ExcelService } from '@app/services/excel.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppraisalDialogComponent } from '../components/appraisalDialog/appraisalDialog.component';
import { DeptMemoEditComponent } from '../components/dept-memo-edit/dept-memo-edit.component';
import { CallDeptMemoFilterRequest } from '../models/call-memo-request.model';
import { MemoTaskDetailsResponse } from '../models/call-memo-response.model';
import { State, getMemoDetailsLoading, getMemoTaskDetails } from '../state';
import { loadMemoTasksDetails } from '../state/actions/call-memo-page.actions';
import { TaskResponse } from '@app/models/call-memo.model';

@UntilDestroy()
@Component({
  selector: 'olla-dept-memo',
  templateUrl: './dept-memo.component.html',
  styleUrls: ['./dept-memo.component.scss']
})
export class DeptMemoComponent implements OnInit, AfterViewInit {
  currentPage = 'Department Call Memos';
  isLoading$ = this.store.select(getMemoDetailsLoading);
  dept$!: Observable<DepartmentResponse[]>;
  toolTip = 'Actions';
  deptOptions: any[] = [];
  displayCoreColumns: string[] = ['position', 'task', 'weight', 'detailsDate', 'score', 'button'];
  displayedColumns: string[] = ['position', 'task', 'weight', 'staffComment', 'detailsDate', 'score', 'mdComment', 'button'];
  dataSource = new MatTableDataSource<TaskResponse>([]);
  kpiDataSource = new MatTableDataSource<TaskResponse>([]);
  coreDataSource = new MatTableDataSource<TaskResponse>([]);
  memoTasksDetails: MemoTaskDetailsResponse[] = [];
  deptInput = new FormControl(0);
  selectedDept!: string;
  expectedArr: number[] = [];
  frequencyOptions = Frequency;
  frequencyInput = new FormControl('All');
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filter: CallDeptMemoFilterRequest = {
    departmentId: '',
    startTime: formatAPIDate(new Date()).split('T')[0],
    endTime: formatAPIDate(new Date()).split('T')[0]
  }

  constructor(
    private dialog: MatDialog,
    private deptService: DepartmentService,
    private store: Store<State>,
    private toast: HotToastService,
    private excel: ExcelService,
    private memoService: CallMemoService,
  ) { }

  ngOnInit() {
    this.dept$ = this.deptService.getDepartments();
    this.store.select(getMemoTaskDetails).pipe(untilDestroyed(this)).subscribe(
      x => {
        this.memoTasksDetails = x;
      }
    )
    this.dept$.pipe(untilDestroyed(this)).subscribe((res) => {
      this.deptOptions = res.map(c => ({ departmentId: c.departmentId, departmentName: c.departmentName }))
    });
    this.deptInput.valueChanges.pipe(untilDestroyed(this))
      .subscribe(() => {
        this.deptOptions.forEach((c) => {
          if (c.departmentId === this.deptInput.value) {
            this.selectedDept = c.departmentName
          }
        });
        this.frequencyInput.setValue('All');
        this.getTasks(this.deptInput.value!.toString());
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
      departmentId: this.deptInput.value!.toString(),
      startTime: formatAPIDate(new Date(this.filter.startTime)).split('T')[0],
      endTime: formatAPIDate(new Date(this.filter.endTime)).split('T')[0],
    }
    this.store.dispatch(loadMemoTasksDetails({ request: {...this.filter }}));
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

  getTaskDate(memoDetailTask: number): string {
    const taskDate = this.memoTasksDetails.filter(x => x.memoTaskId === memoDetailTask)[0]?.scoreDate
    if (taskDate && new Date(taskDate).getFullYear() !== 1000) {
      return taskDate
    }
    return '';
  }

  getTaskNote(memoDetailTask: number): string {
    const taskNote = this.memoTasksDetails.filter(x => x.memoTaskId === memoDetailTask)[0]?.notes
    if (taskNote) {
      return taskNote
    }
    return ' ';
  }

  getTaskScore(memoDetailTask: number): number {
    const taskScore = this.memoTasksDetails.filter(x => x.memoTaskId === memoDetailTask)[0]?.score
    if (this.memoTasksDetails.length || taskScore) {
      return taskScore
    }
    return 9;
  }

  filterFrequency(): void {
    if (this.frequencyInput.value === 'All') {
      this.kpiDataSource.data = this.dataSource.data.filter((task) => task.criteria !== 'core' && task.name !== 'x');
      return;
    }
    let frequencyExist = false;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.frequencyInput.value === this.dataSource.data[i].frequency) {
        frequencyExist = true;
        break;
      }
    }
    if (!frequencyExist) {
      return;
    }
    this.kpiDataSource.data = this.dataSource.data.filter(task => task.frequency === this.frequencyInput.value && task.name !== 'x' && task.criteria !== 'core');
  }

  getTaskComment(memoDetailTask: number): string {
   const taskComment = this.memoTasksDetails.filter(x => x.memoTaskId === memoDetailTask)[0]?.comment;
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
    const detailId = this.memoTasksDetails.filter(x => x.memoTaskId === memoDetailTask)[0]?.id
    if (this.memoTasksDetails.length || detailId !== 0) {
      return detailId
    }
    return 0
  }

  AddOrEdit(memoDetailTask: number): boolean {
    const taskDetail = this.memoTasksDetails.filter(x => x.memoTaskId === memoDetailTask);
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
    const dialogRef = this.dialog.open(DeptMemoEditComponent, {
      height: '600px',
      width: '600px',
      data: { taskId, taskName, deptId: this.deptInput.value, taskDetailId, taskDate, taskNotes, taskScore, taskComment, }
    });
    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.filterMemos();
      }
    })
  }

  openAppraisalDialog(taskName?: string, taskWeight?: number, taskDetailId?: number, taskScore?: number, taskComment?: string): void {
    const dialogRef = this.dialog.open(AppraisalDialogComponent, {
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

  /* exportExcel(): void {
    const data = this.dataSource.data.map((d, i) => {
      const [sn, tasks] = [i + 1, d.name];

      let detailsDate = () => {
        let year = new Date(this.getTaskDate(d.memoTaskId)).getFullYear();
        let month = (new Date(this.getTaskDate(d.memoTaskId)).getMonth() + 1);
        let day = new Date(this.getTaskDate(d.memoTaskId)).getDate();

        if (!day || !month || !year) {
          return ''
        }
        return `${day}-${month}-${year}`;
      };

      const notes = this.getTaskNote(d.memoTaskId);
      const scores = this.getTaskScore(d.memoTaskId);
      const comments = this.getTaskComment(d.memoTaskId);

      return {sn, tasks, notes, detailsDate: detailsDate(), scores, comments}
    }).sort((a: any, b: any) => {
      const dateA = a.detailsDate ? new Date((a.detailsDate).split("").reverse().join("")) : null;
      const dateB = b.detailsDate ? new Date((b.detailsDate).split("").reverse().join("")) : null;
      if (dateA === dateB) {
        return 0
      }
      if (dateA === null) {return 1}
      if (dateB === null) {return -1};
      return dateA < dateB ? -1 : 1;
    });

    const request: ExcelRequest<any> = {
      data,
      title: `${this.selectedDept} Tasks Memo`,
      headers: [
        'S/no', 'Tasks', 'Notes', 'Appraised Date', 'Score', "MD's Comment"
      ],
      deptMemo: `${this.selectedDept} Department`
    }

    this.excel.exportExcel(request);
  } */

  exportExcel(): void {
    const dataDate = this.memoTasksDetails.map((d, i) => {
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
      title: `${this.selectedDept} Tasks Memo`,
      headers: [
        'S/No', 'Tasks', 'Criteria', 'Notes', 'Score', 'Average Score', 'Max Score', 'Appraised Date', "MD's Comment", "Weight", "Wt.X.Score", "Probable Wt.X.Score"
      ],
      deptMemo: `${this.selectedDept} Department`,
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

    this.excel.exportDeptMemoExcel(request);

  }

}

const Frequency = [
  { name: 'All', value: 'All' },
  { name: 'Weekly', value: 'Weekly' },
  { name: 'Monthly', value: 'Monthly' },
  { name: 'Quarterly', value: 'Quarterly' },
  { name: 'Annually', value: 'Annually' }
];

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
