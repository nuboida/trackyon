import { Component, OnInit } from '@angular/core';
import { TaskDeptMemoFilterRequest } from '../models/call-memo-request.model';

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
  constructor() { }

  ngOnInit() {
  }

}
