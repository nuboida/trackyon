import { Injectable, inject } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';
import { OpportunityResponse } from '@app/models/opportunity.model';
import { OpportunityService } from '@app/services/opportunity.service';
import { Observable, of } from 'rxjs';

/* @Injectable({
  providedIn: 'root'
})
export class OpportunityListResolver implements Resolve<OpportunityResponse[]> {

  constructor(private opptService: OpportunityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OpportunityResponse[]> {
    return this.opptService.getOpportunities();
  }
} */

export const OpportunityListResolver: ResolveFn<Observable<OpportunityResponse[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(OpportunityService).getOpportunities()
}
