import { Injectable } from '@angular/core';

import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { OpportunityService } from '@app/services/opportunity.service';

/* NgRx */
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OpportunityItemPageActions, OpportunityItemApiActions } from './actions';
import { HotToastService } from '@ngneat/hot-toast';
import { ErrorResponse } from '@app/models/error.model';

@Injectable()
export class OpportunityItemEffects {

  constructor(private actions$: Actions, private opptService: OpportunityService,
              private toast: HotToastService) { }

  loadOpportunity$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityItemPageActions.loadOpportunity),
        mergeMap(action => this.opptService.getOpportunity(action.opportunityId)
          .pipe(
            map(opportunity => OpportunityItemApiActions.loadOpportunitySuccess({ opportunity })),
            catchError(() => of(OpportunityItemApiActions.loadOpportunityFailure()))
          )
        )
      );
  });

  loadActivities$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityItemPageActions.loadActivities),
        mergeMap(action => this.opptService.getOpportunityActivities(action.opportunityId)
          .pipe(
            map(activities => OpportunityItemApiActions.loadActivitiesSuccess({ activities })),
            catchError(() => of(OpportunityItemApiActions.loadActivitiesFailure()))
          )
        )
      );
  });

  loadActivity$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityItemPageActions.loadActivity),
        mergeMap(action => this.opptService.getOpportunityActivity(action.opportunityId, action.activityId)
          .pipe(
            map(activity => OpportunityItemApiActions.loadActivitySuccess({ activity })),
            catchError(() => {
              this.toast.error('Error retrieving activity');
              return of(OpportunityItemApiActions.loadActivityFailure());
            })
          )
        )
      );
  });

  createActivity$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityItemPageActions.createActivity),
        mergeMap(action => this.opptService.createOpportunityActivity({...action.request})
          .pipe(
            map(() => {
              this.toast.success('Activity Created');
              return OpportunityItemApiActions.createUpdateActivitySuccess();
            }),
            catchError((err: ErrorResponse) => {
              this.toast.error(err.message);
              return of(OpportunityItemApiActions.createUpdateActivityFailure());
            })
          )
        )
      );
  });

  updateActivity$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityItemPageActions.updateActivity),
        mergeMap(action => this.opptService.updateActivity(action.activityId, action.date, action.nextAction)
          .pipe(
            map(() => {
              this.toast.success('Activity Updated');
              return OpportunityItemApiActions.createUpdateActivitySuccess();
            }),
            catchError((err: ErrorResponse) => {
              this.toast.error(err.message);
              return of(OpportunityItemApiActions.createUpdateActivityFailure());
            })
          )
        )
      );
  });

  closeActivity$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityItemPageActions.closeActivity),
        mergeMap(action => this.opptService.closeActivity(action.activityId)
          .pipe(
            map(() => {
              this.toast.success('Activity has been closed');
              return OpportunityItemPageActions.loadActivities({opportunityId: action.opportunityId});
            }),
            catchError((err: ErrorResponse) => {
              this.toast.error(err.message);
              return of(OpportunityItemApiActions.loadActivitiesFailure());
            })
          )
        )
      );
  });

  uploadFile$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityItemPageActions.uploadFile),
        mergeMap(action => this.opptService.uploadOpportunityDocs(action.request)
          .pipe(
            map(() => {
              this.toast.close('uploadFile');
              this.toast.success('File Uploaded');
              return OpportunityItemPageActions.loadOpportunityFiles({opportunityId: action.request.opportunityId});
            }),
            catchError(() => {
              this.toast.close('uploadFile');
              this.toast.error('Failed to Upload');
              return of(OpportunityItemApiActions.loadOpportunityFilesFailure());
            })
          )
        )
      );
  });

  getFile$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(OpportunityItemPageActions.loadOpportunityFiles),
        mergeMap(action => this.opptService.getOpportunityDocs(action.opportunityId)
          .pipe(
            map(files => OpportunityItemApiActions.loadOpportunityFilesSuccess({ files })),
            catchError(() => of(OpportunityItemApiActions.loadOpportunityFilesFailure()))
          )
        )
      );
  });
}
