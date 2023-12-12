import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CallMemoCreateComponent } from './call-memo-create/call-memo-create.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { getCallMemos, getStaffPersonalMemos, State } from './state';
import { loadCallMemos, loadPersonalStaffMemos } from './state/actions/call-memo-page.actions';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CallMemoPersonalFilterRequest, CallMemoResponse } from '@app/models/call-memo.model';
import { of } from 'rxjs';
import { formatDistanceStrict } from 'date-fns';
import { CallMemoDetailComponent } from './components/call-memo-detail/call-memo-detail.component';
import { ExcelRequest } from '@app/models/excel.model';
// import { ExcelService } from '@app/services/excel.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';

@UntilDestroy()
@Component({
  selector: 'olla-call-memo',
  templateUrl: './call-memo.component.html',
  styleUrls: ['./call-memo.component.scss']
})
export class CallMemoComponent implements OnInit, AfterViewInit {

  currentPage = 'Call Memos';
  btnText = 'Memo';
  cardText = 'memo';
  imageSrc = 'assets/Add_notes.svg';

  isLoading$ = of(false);
  date = new Date();
  filter: CallMemoPersonalFilterRequest = {
    staffId: '',
    startTime: new Date(),
    endTime: new Date()
  };
  displayedColumns: string[] = ['position', 'staff', 'date', 'status', 'button'];
  dataSource = new MatTableDataSource<CallMemoResponse>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  calendarOptions: CalendarOptions = {
    plugins: [
      dayGridPlugin,
      interactionPlugin,
      bootstrapPlugin
    ],
    headerToolbar: {
      left: 'dayGridMonth,dayGridWeek,dayGridDay',
      center: 'title',
      right: 'prevYear,prev,next,nextYear'
    },
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    themeSystem: 'bootstrap',
  };

  constructor(
    public dialog: MatDialog,
    private store: Store<State>,
    //private excel: ExcelService
    ) { }

  ngOnInit(): void {

    this.store.select(getCallMemos).pipe(untilDestroyed(this)).subscribe(
      res => this.calendarOptions.events = res);

    this.store.select(getStaffPersonalMemos).pipe(untilDestroyed(this)).subscribe(
      data => this.dataSource.data = data);

    this.store.dispatch(loadCallMemos());
    this.store.dispatch(loadPersonalStaffMemos({request: { ...this.filter } }));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  handleDateClick(arg: any): void {
    const dialogRef = this.dialog.open(CallMemoCreateComponent, {
      width: '800px',
      height: '500px',
      data: { date: { StartTime: arg.date } }
    });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(() => {
      this.store.dispatch(loadCallMemos());
    });
  }

  getMemo(): void {
    this.store.dispatch(loadPersonalStaffMemos({request: { ...this.filter } }));
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

  /* exportExcel(): void {
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
  } */
}
