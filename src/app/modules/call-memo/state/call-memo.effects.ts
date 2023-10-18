import { Injectable } from '@angular/core';

import { mergeMap, map, catchError, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { CallMemoService } from '../services/call-memo.service';

/* NgRx */
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CallMemoPageActions, CallMemoApiActions } from './actions';

@Injectable()
export class CallMemoEffects {

  constructor(private actions$: Actions, private callMemoService: CallMemoService) { }

  loadCallMemos$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(CallMemoPageActions.loadCallMemos),
        mergeMap(() => this.callMemoService.getStaffCallMemos()
          .pipe(
            map(callMemos => CallMemoApiActions.loadCallMemosSuccess({ callMemos })),
            catchError(() => of(CallMemoApiActions.loadCallMemosFailure()))
          )
        )
      );
  });

  loadStaffMemos$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(CallMemoPageActions.loadStaffMemos),
        mergeMap(() => this.callMemoService.getStaffCallMemosAdmin()
          .pipe(
            map(callMemos => CallMemoApiActions.loadStaffCallMemosSuccess({ callMemos })),
            catchError(() => of(CallMemoApiActions.loadStaffCallMemosFailure()))
          )
        )
      );
  });

  loadStaffMemo$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(CallMemoPageActions.loadPersonalStaffMemos),
        mergeMap(action => this.callMemoService.getPersonalStaffCallMemos(action.request)
          .pipe(
            map(callMemos => CallMemoApiActions.loadPersonalStaffMemoSuccess({ callMemos })),
            catchError(() => of(CallMemoApiActions.loadPersonalStaffMemoFailure()))
          )
        )
      );
  });

  loadFilteredMemos$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(CallMemoPageActions.loadFilteredMemos),
        mergeMap(action => this.callMemoService.getFilteredStaffCallMemosAdmin(action.request)
          .pipe(
            map(callMemos => CallMemoApiActions.loadFilteredMemosSuccess({ callMemos })),
            catchError(() => of(CallMemoApiActions.loadFilteredMemosFailure()))
          )
        )
      );
  });

  loadFilteredDeptMemos$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(CallMemoPageActions.loadFilteredDeptMemos),
        mergeMap(action => this.callMemoService.getFilteredDeptMemoAdmin(action.request)
          .pipe(
            map(callDeptMemos => CallMemoApiActions.loadFilteredDeptMemosSuccess({ callDeptMemos })),
            catchError(() => of(CallMemoApiActions.loadFilteredDeptMemosFailure()))
          )
        )
      );
  });

  loadMemoTasksDetailsMemos$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(CallMemoPageActions.loadMemoTasksDetails),
        mergeMap((action) => this.callMemoService.getMemoTaskDetails(action.request)
          .pipe(
            map((memoDetails) => CallMemoApiActions.getMemoTasksSuccess({memoDetails})),
            catchError(() => of(CallMemoApiActions.getMemoTasksFailure()))
          )
        )
      );
  });

  loadMemoTaskStaffDetailsMemos$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(CallMemoPageActions.loadMemoTaskStaffDetails),
        mergeMap((action) => this.callMemoService.getMemoTaskStaffDetails(action.request)
          .pipe(
            map((memoDetails) => CallMemoApiActions.getMemoTaskStaffSuccess({memoDetails})),
            catchError(() => of(CallMemoApiActions.getMemoTaskStaffFailure()))
          )
        )
      );
  });

}
