import { Injectable } from '@angular/core';

import { mergeMap, map, catchError, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { DashboardService } from '@modules/home/dashboard.service';

/* NgRx */
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardPageActions, DashboardApiActions } from './actions';

@Injectable()
export class DashboardEffects {

  constructor(private actions$: Actions, private dashboardService: DashboardService) { }

  loadClients$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(DashboardPageActions.loadClients),
        delay(1000),
        mergeMap(() => this.dashboardService.getClients()
          .pipe(
            map(clients => DashboardApiActions.loadClientsSuccess({clients : [clients.actual, clients.potential]})),
            catchError(() => of(DashboardApiActions.loadClientsFailure()))
          )
        )
      );
  });

  loadOpportunities$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(DashboardPageActions.loadOpportunities),
        delay(1000),
        mergeMap(() => this.dashboardService.getOpportunities()
          .pipe(
            map(opportunities => DashboardApiActions.loadOpportunitesSuccess({ opportunities })),
            catchError(() => of(DashboardApiActions.loadOpportunitiesFailure()))
          )
        )
      );
  });

  loadSales$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(DashboardPageActions.loadSales),
        delay(1000),
        mergeMap(() => this.dashboardService.getSales()
          .pipe(
            map(sales => DashboardApiActions.loadSalesSuccess({ sales })),
            catchError(() => of(DashboardApiActions.loadSalesFailure()))
          )
        )
      );
  });

  loadStats$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(DashboardPageActions.loadStats),
        delay(1000),
        mergeMap(() => this.dashboardService.getStats()
          .pipe(
            map(stats => DashboardApiActions.loadStatsSuccess({ stats })),
            catchError(() => of(DashboardApiActions.loadStatsFailure()))
          )
        )
      );
  });

  loadStages$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(DashboardPageActions.loadStages),
        delay(1000),
        mergeMap(() => this.dashboardService.getStages()
          .pipe(
            map(stageData => DashboardApiActions.loadStagesSuccess({ stages: {
              colors: [{ backgroundColor: stageData.map(x => x.stageColor)}],
              labels: stageData.map(x => x.stageName),
              data: stageData.map(x => x.number)
            } })),
            catchError(() => of(DashboardApiActions.loadStagesFailure()))
          )
        )
      );
  });

  loadMonthlySales$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(DashboardPageActions.loadMonthlySales),
        delay(1000),
        mergeMap(() => this.dashboardService.getMonthlySales()
          .pipe(
            map(monthlySales => DashboardApiActions.loadMonthlySalesSuccess({ monthlySales })),
            catchError(() => of(DashboardApiActions.loadMonthlySalesFailure()))
          )
        )
      );
  });
}
