import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StaffResponse } from '@app/models/staff.model';
import { StaffService } from '@app/services/staff.service';
import { Observable } from 'rxjs';
import { formatDistanceStrict } from 'date-fns';
import { CallMemoDetailComponent } from '../components/call-memo-detail/call-memo-detail.component';
import { CallMemoFilterRequest, CallMemoResponse } from '@app/models/call-memo.model';
import { Store } from '@ngrx/store';
import { getStaffMemos, getStaffMemosLoading, State } from '../state';
import { loadFilteredMemos, loadStaffMemos } from '../state/actions/call-memo-page.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HotToastService } from '@ngneat/hot-toast';
import { ExcelRequest } from '@app/models/excel.model';
import { ExcelService } from '@app/services/excel.service';

@UntilDestroy()
@Component({
  selector: 'olla-call-memo-list',
  templateUrl: './call-memo-list.component.html',
  styles: [
  ]
})
export class CallMemoListComponent implements OnInit, AfterViewInit {

  currentPage = 'Staff Call Memos';
  isLoading$ = this.store.select(getStaffMemosLoading);
  staff$!: Observable<StaffResponse[]>;
  displayedColumns: string[] = ['position', 'staff', 'date', 'button'];
  dataSource = new MatTableDataSource<CallMemoResponse>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filter: CallMemoFilterRequest = {
    staffs: [],
    startTime: new Date(),
    endTime: new Date()
  };
  constructor(
    public dialog: MatDialog,
    private staffService: StaffService,
    private store: Store<State>,
    private toast: HotToastService,
    private excel: ExcelService
    ) { }

  ngOnInit(): void {
    this.staff$ = this.staffService.getStaffs();
    this.store.select(getStaffMemos).pipe(untilDestroyed(this)).subscribe(x => this.dataSource.data = x);
    this.store.dispatch(loadStaffMemos());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  filterMemos(): void {
    if (this.filter.startTime === null || this.filter.endTime === null) {
      this.toast.warning('Enter a valid date range');
      return;
    }
    this.store.dispatch(loadFilteredMemos({ request: { ...this.filter } }));
  }

  viewMemo(memoId: string): void {
    const memo = {...this.dataSource.data.find(x => x.callMemoId === memoId)};

    memo.memoActivities = memo.memoActivities?.map(x => {
      const activities = {...x};
      activities.duration = formatDistanceStrict(new Date(x.assignmentStartTime), new Date(x.assignmentEndTime));
      return activities;
    });
    this.dialog.open(CallMemoDetailComponent, {
      width: '600px',
      height: '550px',
      data: memo
    });
  }

  exportExcel(): void {
    const data: any[] = [];

    this.dataSource.data.forEach((d) => {

      const staff = d.staff;
      const useDate = new Date(d.assignmentDate);
      const [day, month, year] = [useDate.getDate(), useDate.getMonth() + 1, useDate.getFullYear()];
      const assignDate = `${day > 10 ? day : '0' + day}/${month > 10 ? month : '0' + month}/${year}`;

      d.memoActivities.forEach(info => {
        const [project, task, notes] = [info.memoProject, info.memoTask, info.assignmentNote];
        const duration = formatDistanceStrict(new Date(info.assignmentStartTime), new Date(info.assignmentEndTime));

        data.push({ staff, assignDate, project, task, duration, notes });
      });
    });

    const request: ExcelRequest<any> = {
      data,
      title: 'Memos',
      headers: [ 'Staff', 'Date', 'Project', 'Task', 'Duration', 'Notes' ]
    };

    this.excel.exportExcel(request);
  }

}


