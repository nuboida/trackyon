import { Component, OnInit } from '@angular/core';
import { TaskDeptMemoFilterRequest } from '../models/call-memo-request.model';
import { Observable } from 'rxjs';
import { StaffResponse } from '@app/models/staff.model';
import { StaffService } from '@app/services/staff.service';
import { FormControl } from '@angular/forms';
import { CallMemoService } from '@app/services/call-memo.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatTableDataSource } from '@angular/material/table';
import { TaskResponse } from '@app/models/call-memo.model';
import { HotToastService } from '@ngneat/hot-toast';

@UntilDestroy()
@Component({
  selector: 'olla-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
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
  staffTask: FormControl = new FormControl('');

  constructor(
    private staffService: StaffService,
    private memoService: CallMemoService,
    private toast: HotToastService
  ) { }

  ngOnInit() {
    this.staff$ = this.staffService.getStaffs();
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

}
