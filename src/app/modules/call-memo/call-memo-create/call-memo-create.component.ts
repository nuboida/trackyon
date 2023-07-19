import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CallMemoActivityTable, CallMemoRequest, CallMemoUpdateRequest, ProjectResponse, TaskResponse } from '@app/models/call-memo.model';
import { CallMemoService } from '@app/services/call-memo.service';
import { onlyNumberValidator } from '@shared/validators/numbers-only.validator';
import { Observable } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '@app/services/auth.service';

@UntilDestroy()
@Component({
  selector: 'olla-call-memo-create',
  templateUrl: './call-memo-create.component.html',
  styleUrls: ['./call-memo-create.component.scss']
})
export class CallMemoCreateComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['position', 'project', 'task', 'start', 'end', 'hour', 'button'];
  dataSource = new MatTableDataSource<CallMemoActivityTable>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  addToolTip = 'Add Assignment';
  cancelToolTip = 'Close';
  cancelIcon = 'clear';
  cancelColor = 'accent';
  currentPage = 'Memo for ';

  isLoading = false;
  isClosed = false;

  duration = '08:00';
  date: Date;
  form: FormGroup;

  projects$: Observable<ProjectResponse[]>;
  tasks: TaskResponse[] = [];
  deptId!: string;

  saving = false;
  formMode = false;
  editMode = false;

  callMemoId: string;
  callMemoActivityId: number;

  startHourCtrl = new FormControl('', [Validators.required, Validators.min(0), Validators.max(23), onlyNumberValidator]);
  startMinuteCtrl = new FormControl('', [Validators.required, Validators.min(0), Validators.max(59), onlyNumberValidator]);
  endHourCtrl = new FormControl('', [Validators.required, Validators.min(0), Validators.max(23), onlyNumberValidator]);
  endMinuteCtrl = new FormControl('', [Validators.required, Validators.min(0), Validators.max(59), onlyNumberValidator]);
  durationCtrl = new FormControl({value: '', disabled: true});

  constructor(private toast: HotToastService, private fb: FormBuilder, private auth: AuthService, private memoService: CallMemoService,
              @Inject(MAT_DIALOG_DATA) public data: {date: any }) {
    this.date = data.date.StartTime as Date;
    this.currentPage += this.date.toDateString();
    this.auth.user$.subscribe(
      user => {
        this.deptId = user?.departmentId;
      }
    )
  }

  ngOnInit(): void {
    this.getMemos();

    this.projects$ = this.memoService.getProjects();
    this.memoService.getTasks(this.deptId).pipe(untilDestroyed(this))
      .subscribe((res) => {
        this.tasks = res.filter((task) => task.criteria !== 'core' && task.name !== 'x');
      })

    this.form = this.fb.group({
      projectId: [0, Validators.required],
      taskId: [0, Validators.required],
      startHour: this.startHourCtrl,
      startMinute: this.startMinuteCtrl,
      endHour: this.endHourCtrl,
      endMinute: this.endMinuteCtrl,
      duration: this.durationCtrl,
      notes: ['', Validators.required]
    });

    this.startHourCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateDuration());
    this.startMinuteCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateDuration());
    this.endHourCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateDuration());
    this.endMinuteCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.calculateDuration());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getMemos(): void {
    this.isLoading = true;
    this.memoService.getCallMemo(this.date).pipe(untilDestroyed(this)).subscribe(
      data => {
        if (data) {
          this.isClosed = data.isClosed;
          this.callMemoId = data.callMemoId;
          this.dataSource.data = data.memoActivities.map(x => {
            const start = new Date(x.assignmentStartTime);
            const end = new Date(x.assignmentEndTime);
            this.duration = this.timeDiffCalc(end, start);
            const resp: CallMemoActivityTable = {
              id: x.memoActivityId,
              projectId: x.memoProjectId,
              project: x.memoProject,
              task: x.memoTask,
              taskId: x.memoTaskId,
              starttime: `${this.formateTime(start.getHours())}:${this.formateTime(start.getMinutes())}`,
              endtime: `${this.formateTime(end.getHours())}:${this.formateTime(end.getMinutes())}`,
              notes: x.assignmentNote,
              duration: this.timeDiffCalc(end, start)
            };
            return resp;
          });
        }

        this.isLoading = false;
      },
      () => {
        this.toast.error('Error retrieving Data');
        this.isLoading = false;
      }
    );
  }

  get f(): any { return this.form.controls; }

  addAssignment(): void {
    this.formMode = true;
    this.editMode = false;
  }

  cancel(): void {
    this.form.reset();
    this.formMode = false;
    this.editMode = false;
  }

  openActivity(id: number): void {
    this.callMemoActivityId = id;
    const data = this.dataSource.data.find(x => x.id === id);

    this.formMode = true;
    this.editMode = true;
    if (this.isClosed) {
      this.form.disable();
    }
    const start = data.starttime.split(':');
    const end = data.endtime.split(':');

    this.form.setValue({
      projectId: data.projectId,
      taskId: data.taskId,
      startHour: start[0],
      startMinute: start[1],
      endHour: end[0],
      endMinute: end[1],
      duration: data.duration,
      notes: data.notes
    });
  }

  createAssignment(): void {
    this.saving = true;

    const memoProjectId = this.form.value.projectId as number;
    const memoTaskId = this.form.value.taskId as number;
    const assignmentNote = this.form.value.notes as string;

    const startHour = this.startHourCtrl.value;
    const startMinute = this.startMinuteCtrl.value;
    const endHour = this.endHourCtrl.value;
    const endMinute = this.endMinuteCtrl.value;
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    const day = this.date.getDate();
    const [start, end] = [new Date(year, month, day, startHour, startMinute), new Date(year, month, day, endHour, endMinute)];
    const assignmentStartTime = start;
    const assignmentEndTime = end;

    if (this.editMode) {
      const request: CallMemoUpdateRequest = {
        memoProjectId,
        memoTaskId,
        assignmentNote,
        assignmentStartTime,
        assignmentEndTime,
        callMemoId: this.callMemoId,
        callMemoActivityId: this.callMemoActivityId,
        staffId: ''
      };

      this.memoService.updateCallMemoActivity(request).pipe(untilDestroyed(this)).subscribe(
        () => {
          this.saving = false;
          this.toast.success('Assignment updated');
          this.cancel();
          this.getMemos();
        },
        err => {
          this.saving = false;
          this.toast.error(err.message);
        }
      );

    }

    if (!this.editMode) {
      const request: CallMemoRequest = {
        memoProjectId,
        memoTaskId,
        assignmentNote,
        assignmentStartTime,
        assignmentEndTime,
        companyId: '',
        staffId: '',
      };
      this.memoService.createCallMemoActivity(request).pipe(untilDestroyed(this)).subscribe(
        () => {
          this.saving = false;
          this.toast.success('Assignment added');
          this.cancel();
          this.getMemos();
        },
        err => {
          this.saving = false;
          this.toast.error(err.message);
        }
      );
    }
  }

  closeCallMemo(): void {
    this.memoService.closeCallMemo(this.date).pipe(untilDestroyed(this)).subscribe(
      () => {
        this.toast.success('Submitted');
        this.cancel();
        this.isClosed = true;
      },
      () => this.toast.error('Error submitting memo')
    );
  }

  private calculateDuration(): void {
    const startHour = this.startHourCtrl.value;
    const startMinute = this.startMinuteCtrl.value;
    const endHour = this.endHourCtrl.value;
    const endMinute = this.endMinuteCtrl.value;

    const startValid = !isNaN(startHour) && !isNaN(startMinute)
                      && Math.abs(startHour) < 24 && Math.abs(startMinute) < 60;

    const endValid = !isNaN(endHour) && !isNaN(endMinute)
    && Math.abs(+endHour) < 24 && Math.abs(+endMinute) < 60
    && (+endHour > +startHour || (+endHour === +startHour && +endMinute > +startMinute));

    if (!startValid || !endValid) {
      this.durationCtrl.setValue('');
      return;
    }

    const endDate = new Date(2020, 1, 1, +endHour, +endMinute);
    const startDate = new Date(2020, 1, 1, +startHour, +startMinute);

    const difference = this.timeDiffCalc(endDate, startDate);
    this.durationCtrl.setValue(difference);

  }

  private timeDiffCalc(dateFuture: any, dateNow: any): string {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    const difference = `${hours}:${this.formateTime(minutes)}`;

    return difference;
  }

  private formateTime(num: number): string {
   return num < 10 ? '0' + num : '' + num;
  }
}
