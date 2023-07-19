import { ActivityResponse, FileUploadResponse, OpportunityItemResponse } from '@app/models/opportunity.model';
import { createAction, props } from '@ngrx/store';

export const loadOpportunitySuccess = createAction(
  '[Opportunity Item API] Load Opportunity Success',
  props<{ opportunity: OpportunityItemResponse }>()
);

export const loadOpportunityFailure = createAction(
  '[Opportunity Item API] Load Opportunity Failure'
);

export const loadOpportunityFilesSuccess = createAction(
  '[Opportunity Item API] Load Opportunity Files Success',
  props<{ files: FileUploadResponse[] }>()
);

export const loadOpportunityFilesFailure = createAction(
  '[Opportunity Item API] Load Opportunity Files Failure'
);

export const loadActivitiesSuccess = createAction(
  '[Activity List API] Load Activities Success',
  props<{ activities: ActivityResponse[] }>()
);

export const loadActivitiesFailure = createAction(
  '[Activity List API] Load Activities Failure'
);

export const loadActivitySuccess = createAction(
  '[Activity Item API] Load Activity Success',
  props<{ activity: ActivityResponse }>()
);

export const loadActivityFailure = createAction(
  '[Activity Item API] Load Activity Failure'
);

export const createUpdateActivitySuccess = createAction(
  '[Activity Item API] Create / Update Activity Success'
);

export const createUpdateActivityFailure = createAction(
  '[Activity Item API] Create / Update Activity Failure'
);
