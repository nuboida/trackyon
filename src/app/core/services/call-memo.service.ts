import { Injectable } from '@angular/core';
import { formatAPIDate } from '@app/helpers/date.helper';
import { CallMemoRoutes } from '@app/helpers/routes.helper';
import {
  ProjectResponse, ProjectRequest, TaskResponse,
  TaskRequest, CallMemoResponse, CallMemoRequest,
  CallMemoDisplay,
  CallMemoUpdateRequest,
  CallMemoFilterRequest,
  CallMemoPersonalFilterRequest,
  CreateNewTaskRequest,
  EditTask,
} from '@app/models/call-memo.model';
import { GlobalEdit, GlobalResponse } from '@app/models/response.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable()
export class CallMemoService {

  companyId!: string;
  staffId!: string;
  constructor(private api: ApiService, private auth: AuthService) {
    this.auth.user$.subscribe(
      user => {
        this.companyId = user?.companyId;
        this.staffId = user?.staffId;
      }
    );
  }

  getCallMemo(data: Date): Observable<CallMemoResponse> {
    const date = formatAPIDate(data);
    const request = { staffId: this.staffId, date };
    return this.api.post<CallMemoResponse>(CallMemoRoutes.GetCallMemo, request);
  }

  closeCallMemo(data: Date): Observable<GlobalResponse> {
    const date = formatAPIDate(data);
    const request = { staffId: this.staffId, date };
    return this.api.post<GlobalResponse>(CallMemoRoutes.CloseCallMemo, request);
  }

  createCallMemoActivity(request: CallMemoRequest): Observable<GlobalResponse> {
    request.staffId = this.staffId;
    request.companyId = this.companyId;
    request.assignmentEndTime = formatAPIDate(new Date(request.assignmentEndTime));
    request.assignmentStartTime = formatAPIDate(new Date(request.assignmentStartTime));
    return this.api.post<GlobalResponse>(CallMemoRoutes.CreateCallMemo, request);
  }

  updateCallMemoActivity(request: CallMemoUpdateRequest): Observable<GlobalResponse> {
    request.staffId = this.staffId;
    request.assignmentEndTime = formatAPIDate(new Date(request.assignmentEndTime));
    request.assignmentStartTime = formatAPIDate(new Date(request.assignmentStartTime));
    return this.api.put<GlobalResponse>(CallMemoRoutes.UpdateCallMemoActivity, request);
  }

  removeCallMemoActivity(callMemoId: string, callMemoActivityId: number): Observable<GlobalResponse> {
    return this.api.delete<GlobalResponse>(CallMemoRoutes.RemoveCallMemoActivity.replace('staffId', this.staffId)
    .replace('callMemoId', callMemoId).replace('activityId', callMemoActivityId.toString()));
  }

  getProjects(): Observable<ProjectResponse[]> {
    return this.api.get<ProjectResponse[]>(CallMemoRoutes.ListProject.replace('companyId', this.companyId));
  }

  createProject(name: string): Observable<GlobalResponse> {
    const request: ProjectRequest = {
      name, companyId: this.companyId
    };
    return this.api.post<GlobalResponse>(CallMemoRoutes.CreateProject, request);
  }

  editProject(request: GlobalEdit): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(CallMemoRoutes.EditProject, request);
  }

  getTasks(departmentId: string = '0'): Observable<TaskResponse[]> {
    return this.api.get<TaskResponse[]>(CallMemoRoutes.ListTask.replace('companyId', this.companyId)
    .replace('departmentId', departmentId));
  }

  getTaskByStaff(staffId: string): Observable<TaskResponse[]> {
    return this.api.get<TaskResponse[]>(CallMemoRoutes.ListTaskByStaff.replace('staffId', staffId))
  }

  createTask(request: TaskRequest): Observable<GlobalResponse> {
    const requestTask: CreateNewTaskRequest = {
      ...request,
      companyId: this.companyId
    };
    return this.api.post<GlobalResponse>(CallMemoRoutes.CreateTask, requestTask);
  }

  editTask(request: EditTask): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(CallMemoRoutes.EditTask, request);
  }
}
