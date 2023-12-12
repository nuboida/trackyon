import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskDeptResolver implements Resolve<any> {
  constructor(){}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const deptId = route.paramMap.get("deptId");
    const startDate = route.paramMap.get("startDate");
    const endDate = route.paramMap.get("endDate");

    return {deptId, startDate, endDate}
  }
}
