import { ActivityCreateRequest, FileUploadRequest } from '@app/models/opportunity.model';
import { createAction, props } from '@ngrx/store';

export const loadOpportunity = createAction('[Opportunity Item Page] Load Opportunities',
props<{ opportunityId: string }>());

export const loadActivities = createAction('[Opportunity Item Page] Load Activities',
props<{ opportunityId: string }>());

export const loadActivity = createAction('[Opportunity Item Page] Load Activity',
props<{ opportunityId: string, activityId: number }>());

export const clearActivity = createAction('[Opportunity Item Page] Clear Activity');

export const createActivity = createAction('[Opportunity Item Page] Create Activity',
props<{ request: ActivityCreateRequest }>());

export const updateActivity = createAction('[Opportunity Item Page] Update Activity',
props<{ activityId: number, date: Date, nextAction: string}>());

export const closeActivity = createAction('[Opportunity Item Page] Close Activity',
props<{ opportunityId: string, activityId: number }>());

export const uploadFile = createAction('[Opportunity Item Page] Upload File',
props<{ request: FileUploadRequest }>());

export const loadOpportunityFiles = createAction('[Opportunity Item Page] Load Opportunity Files',
props<{ opportunityId: string }>());
