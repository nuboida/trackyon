import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MemoTaskStaffDetailsResponse } from '@modules/call-memo/models/call-memo-response.model';
import { CallMemoService } from '@modules/call-memo/services/call-memo.service';
import { getMemoTaskStaffDetails } from '@modules/call-memo/state';
import { Store } from '@ngrx/store';
import { Observable, forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskStaffResolver implements Resolve<any> {
  constructor(
    private store: Store,
    private callMemoService: CallMemoService
  ){}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const staff = route.paramMap.get("staffId");
    const startDate = route.paramMap.get("startDate");
    const endDate = route.paramMap.get("endDate");
    const task = this.callMemoService.getMemoTaskStaffDetails({staffId: staff, startTime: startDate, endTime: endDate})

    return task;
  }
}
