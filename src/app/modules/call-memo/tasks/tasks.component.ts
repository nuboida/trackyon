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
import { State } from '../state';
import { loadMemoTaskStaffDetails } from '../state/actions/call-memo-page.actions';
import { MemoTaskStaffDetailsResponse } from '../models/call-memo-response.model';
import { MatDialog } from '@angular/material/dialog';
import { StaffMemoEditComponent } from '../components/staff-memo-edit/staff-memo-edit.component';
import { StaffAppraisalDialogComponent } from '../components/staffAppraisalDialog/staffAppraisalDialog.component';

@UntilDestroy()
@Component({
  selector: 'olla-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit, AfterViewInit {
  currentPage = 'Tasks Call Memo';
  displayCoreColumns: string[] = ['position', 'task', 'weight', 'detailsDate', 'score', 'button'];
  displayedColumns: string[] = ['position', 'task', 'weight', 'staffComment', 'detailsDate', 'score', 'mdComment', 'button'];
  toolTip = 'Actions';
  filter: TaskDeptMemoFilterRequest = {
    staffId: '',
    startTime: new Date(),
    endTime: new Date()
  }
  dataSource = new MatTableDataSource<TaskResponse>([]);
  kpiDataSource = new MatTableDataSource<TaskResponse>([]);
  coreDataSource = new MatTableDataSource<TaskResponse>([]);
  staff$!: Observable<StaffResponse[]>;
  activeStaffs: StaffResponse[] = [];
  staffTask: FormControl = new FormControl('');
  memoTaskDetails: MemoTaskStaffDetailsResponse[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private staffService: StaffService,
    private memoService: CallMemoService,
    private toast: HotToastService,
    private store: Store<State>,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.staff$ = this.staffService.getStaffs();
    this.staffService.getStaffs().pipe(untilDestroyed(this)).subscribe((staff) => {
      this.activeStaffs = staff.filter((data) => data.active);
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

  getTaskDate(memoDetailTask: number): string {
    const taskDate = this.memoTaskDetails.filter(x => x.memoTaskId === memoDetailTask)[0]?.scoreDate;
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

}
