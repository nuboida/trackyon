import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskStaffResolver implements Resolve<any> {
  constructor(){}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const staff = route.paramMap.get("staffId");
    const startDate = route.paramMap.get("startDate");
    const endDate = route.paramMap.get("endDate");

    return {staff, startDate, endDate}
  }
}
