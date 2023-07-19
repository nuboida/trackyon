import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StaffResponse } from '@app/models/staff.model';
import { OpportunityService } from '@app/services/opportunity.service';
import { StaffService } from '@app/services/staff.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StaffListResolver implements Resolve<StaffResponse[]> {
  constructor(private staffService: StaffService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<StaffResponse[]> {
    const salesStaffs = this.staffService.getStaffs()
    return salesStaffs
  }
}


@Injectable({
  providedIn: 'root'
})
export class AllOpportunityListResolver implements Resolve<any> {
  constructor(private opportunityService: OpportunityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const opportunities = this.opportunityService.getOpportunities();
    return opportunities;
  }
}
