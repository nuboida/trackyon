import { Injectable } from '@angular/core';
import { formatAPIDate } from '@app/helpers/date.helper';
import { ApiService } from '@app/services/api.service';
import { AuthService } from '@app/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CallMemoCalendar } from '../models/call-memo-display.model';
import { CallDeptMemoFilterRequest, CallMemoFilterRequest, CallMemoPersonalFilterRequest, CallStaffMemoDetailFilterRequest } from '../models/call-memo-request.model';
import { CallMemoResponse, DetailSubmitResponse, EditTaskDetailRequest, MemoTaskDetailRequest, MemoTaskDetailsResponse, MemoTaskStaffDetailRequest, MemoTaskStaffDetailsResponse, UpdateScoreRequest } from '../models/call-memo-response.model';
import { GlobalResponse } from '@app/models/response.model';

@Injectable({
  providedIn: 'root'
})
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

  getStaffCallMemos(): Observable<CallMemoCalendar[]> {
    return this.api.get<CallMemoResponse[]>(`callmemo/staff/${this.staffId}`).pipe(
            map(res => {
              return res.map(resp => {
                const response: CallMemoCalendar = {
                  title: 'Call Memo',
                  allDay: true,
                  className: 'bg-info text-white',
                  start: resp.assignmentDate
                };
                return response;
              });
            })
          );
  }

  getPersonalStaffCallMemos(filter: CallMemoPersonalFilterRequest): Observable<CallMemoResponse[]> {
    const request = {
      ...filter,
      staffId : this.staffId,
      startTime: formatAPIDate(new Date(filter.startTime)),
      endTime: formatAPIDate(new Date(filter.endTime))
    } as CallMemoPersonalFilterRequest;

    return this.api.post<CallMemoResponse[]>(`report/${this.companyId}/staff/call-memo`, request);
  }

  getStaffCallMemosAdmin(): Observable<CallMemoResponse[]> {
    return this.api.get<CallMemoResponse[]>(`report/${this.companyId}/call-memo/${this.staffId}`);
  }

  getFilteredStaffCallMemosAdmin(filter: CallMemoFilterRequest): Observable<CallMemoResponse[]> {
    const request = {
      ...filter,
      startTime: formatAPIDate(new Date(filter.startTime)),
      endTime: formatAPIDate(new Date(filter.endTime))
    } as CallMemoFilterRequest;

    return this.api.post<CallMemoResponse[]>(`report/${this.companyId}/call-memo/${this.staffId}`, request);
  }

  getFilteredDeptMemoAdmin(filter: CallDeptMemoFilterRequest): Observable<CallMemoResponse[]> {
    const request = {
      ...filter,
      companyId: this.companyId,
      startTime: formatAPIDate(new Date(filter.startTime)),
      endTime: formatAPIDate(new Date(filter.endTime))
    } as CallDeptMemoFilterRequest;

    return this.api.post<CallMemoResponse[]>(`callmemo/staffs/activities/departmentId/date-range`, request)
  }

  getMemoTaskDetails(filter: CallDeptMemoFilterRequest): Observable<MemoTaskDetailsResponse[]> {

    return this.api.get<MemoTaskDetailsResponse[]>(`memotasksdetails/taskdetails/${this.companyId}/${filter.departmentId}/${filter.startTime}/${filter.endTime}`);
  }

  getMemoTaskStaffDetails(filter: CallStaffMemoDetailFilterRequest): Observable<MemoTaskStaffDetailsResponse[]> {
    return this.api.get<MemoTaskStaffDetailsResponse[]>(`memotaskstaffdetail/taskstaffdetails/${this.companyId}/${filter.staffId}/${filter.startTime}/${filter.endTime}`);
  }

  addTaskDetail(request: MemoTaskDetailRequest): Observable<DetailSubmitResponse> {
    const queryRequest: MemoTaskDetailRequest = {
      ...request,
      detailsDate: formatAPIDate(new Date(request.detailsDate)),
      companyId: this.companyId
    }
    return this.api.post<DetailSubmitResponse>(`memotasksdetails/taskdetails/create`, queryRequest);
  }

  addStaffTaskDetail(request: MemoTaskStaffDetailRequest): Observable<DetailSubmitResponse> {
    const queryRequest: MemoTaskStaffDetailRequest = {
      ...request,
      detailsDate: formatAPIDate(new Date(request.detailsDate)),
      companyId: this.companyId
    }
    return this.api.post<DetailSubmitResponse>(`memotasksdetails/taskdetails/create`, queryRequest);
  }

  addAppraisal(request: UpdateScoreRequest): Observable<DetailSubmitResponse> {
    const queryRequest: UpdateScoreRequest = {
      ...request,
      scoreDate: formatAPIDate(new Date(request.scoreDate)),
    };
    return this.api.post<DetailSubmitResponse>(`memotasksdetails/taskdetails/update-score`, queryRequest);
  }

  addStaffAppraisal(request: UpdateScoreRequest): Observable<DetailSubmitResponse> {
    const queryRequest: UpdateScoreRequest = {
      ...request,
      scoreDate: formatAPIDate(new Date(request.scoreDate)),
    };
    return this.api.post<DetailSubmitResponse>(`memotaskstaffdetail/taskstaffdetails/update-score`, queryRequest);
  }

  deleteAppraisal(id: number): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(`memoTasksDetails/taskDetails/delete/${id}`)
  }

  deleteStaffAppraisal(id: number): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(`memoTaskstaffDetail/taskstaffDetails/delete/${id}`)
  }

  editTaskDetails(request: EditTaskDetailRequest): Observable<DetailSubmitResponse> {
    return this.api.post<DetailSubmitResponse>(`memotasksdetails/taskdetails/edit`, request)
  }
  editTaskStaffDetails(request: EditTaskDetailRequest): Observable<DetailSubmitResponse> {
    return this.api.post<DetailSubmitResponse>(`memotaskstaffdetail/taskstaffdetails/edit`, request)
  }
}
