import { Injectable, inject } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';
import { ActivityResponse, OpportunityItemResponse } from '@app/models/opportunity.model';
import { OpportunityService } from '@app/services/opportunity.service';
import {  forkJoin, Observable } from 'rxjs';

/* @Injectable({
  providedIn: 'root'
})
export class OpportunityItemResolver implements Resolve<[OpportunityItemResponse, ActivityResponse[]]> {
  constructor(private opptService: OpportunityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[OpportunityItemResponse, ActivityResponse[]]> {
    const id = route.paramMap.get('id') as string;
    const opportunity = this.opptService.getOpportunity(id);
    const activities = this.opptService.getOpportunityActivities(id);
    return forkJoin([opportunity, activities]);
  }
} */

export const OpportunityItemResolver: ResolveFn<Observable<[OpportunityItemResponse, ActivityResponse[]]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const opportunity = inject(OpportunityService).getOpportunity(route.paramMap.get('id')!);
  const activities = inject(OpportunityService).getOpportunityActivities(route.paramMap.get('id')!);
  return forkJoin([opportunity, activities]);
}
