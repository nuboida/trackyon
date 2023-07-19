import { OpportunityResponse } from '@app/models/opportunity.model';
import { createAction, props } from '@ngrx/store';

export const loadOpportunitiesSuccess = createAction(
  '[Opportunity List API] Load Opportunities Success',
  props<{ opportunities: OpportunityResponse[] }>()
);

export const loadOpportunitiesFailure = createAction(
  '[Opportunity List API] Load Opportunities Failure'
);
