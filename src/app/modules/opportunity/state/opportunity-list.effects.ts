import { Injectable } from '@angular/core';

import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { OpportunityService } from '@app/services/opportunity.service';

/* NgRx */
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OpportunityListPageActions, OpportunityListApiActions } from './actions';

@Injectable()
export class OpportunityListEffects {

  constructor(private actions$: Actions, private opptService: OpportunityService) { }

  loadOpportunities$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityListPageActions.loadOpportunities),
        mergeMap(() => this.opptService.getOpportunities()
          .pipe(
            map(opportunities => OpportunityListApiActions.loadOpportunitiesSuccess({ opportunities })),
            catchError(() => of(OpportunityListApiActions.loadOpportunitiesFailure()))
          )
        )
      );
  });

  loadClientOpportunities$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityListPageActions.loadClientOpportunities),
        mergeMap(action => this.opptService.getOpportunitiesByClient(action.request)
          .pipe(
            map(opportunities => OpportunityListApiActions.loadOpportunitiesSuccess({ opportunities })),
            catchError(() => of(OpportunityListApiActions.loadOpportunitiesFailure()))
          )
        )
      );
  });

  loadYearOpportunities$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityListPageActions.loadYearOpportunities),
        mergeMap(action => this.opptService.getOpportunitiesByYear(action.year)
          .pipe(
            map(opportunities => OpportunityListApiActions.loadOpportunitiesSuccess({ opportunities })),
            catchError(() => of(OpportunityListApiActions.loadOpportunitiesFailure()))
          )
        )
      );
  });
  loadMonthOpportunities$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityListPageActions.loadMonthOpportunities),
        mergeMap(action => this.opptService.getOpportunitiesByMonth(action.year, action.month)
          .pipe(
            map(opportunities => OpportunityListApiActions.loadOpportunitiesSuccess({ opportunities })),
            catchError(() => of(OpportunityListApiActions.loadOpportunitiesFailure()))
          )
        )
      );
  });

  loadDaterangeOpportunities$ = createEffect(() => {
    return this.actions$
    .pipe(
      ofType(OpportunityListPageActions.loadDaterangeOpportunities),
      mergeMap(action => this.opptService.getOpportunitiesByDaterange(action.request)
      .pipe(
        map(opportunities => OpportunityListApiActions.loadOpportunitiesSuccess({ opportunities })),
        catchError(() => of(OpportunityListApiActions.loadOpportunitiesFailure()))
        )
      )
    );
  });

  loadHalfYearOpportunities$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityListPageActions.loadHalfYearOpportunities),
        mergeMap(action => this.opptService.getOpportunitiesByHalf(action.year, action.half)
          .pipe(
            map(opportunities => OpportunityListApiActions.loadOpportunitiesSuccess({ opportunities })),
            catchError(() => of(OpportunityListApiActions.loadOpportunitiesFailure()))
          )
        )
      );
  });

  loadQuarterOpportunities$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityListPageActions.loadQuarterOpportunities),
        mergeMap(action => this.opptService.getOpportunitiesByQuarter(action.year, action.quarter)
          .pipe(
            map(opportunities => OpportunityListApiActions.loadOpportunitiesSuccess({ opportunities })),
            catchError(() => of(OpportunityListApiActions.loadOpportunitiesFailure()))
          )
        )
      );
  });

  loadMainStaffOpportunities$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityListPageActions.loadMainStaffOpportunities),
        mergeMap((action) => this.opptService.getOpportunitiesMainStaff(action.staffId)
          .pipe(
            map(opportunities => OpportunityListApiActions.loadOpportunitiesSuccess({ opportunities })),
            catchError(() => of(OpportunityListApiActions.loadOpportunitiesFailure()))
          )
        )
      );
  });

  loadYearOpenOpportunities$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityListPageActions.loadYearOpenOpportunities),
        mergeMap(action => this.opptService.getOpenOpportunitiesByYear(action.year)
          .pipe(
            map(opportunities => OpportunityListApiActions.loadOpportunitiesSuccess({ opportunities })),
            catchError(() => of(OpportunityListApiActions.loadOpportunitiesFailure()))
          )
        )
      );
  });

  loadYearClosedOpportunities$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityListPageActions.loadYearClosedOpportunities),
        mergeMap(action => this.opptService.getClosedOpportunitiesByYear(action.year)
          .pipe(
            map(opportunities => OpportunityListApiActions.loadOpportunitiesSuccess({ opportunities })),
            catchError(() => of(OpportunityListApiActions.loadOpportunitiesFailure()))
          )
        )
      );
  });

}
