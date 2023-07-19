import { OpportunityResponse } from '@app/models/opportunity.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AppState from '../../../state/app.state';
import { OpportunityState, featureKey } from './opportunity.reducer';

export interface State extends AppState.State {
  opportunities: OpportunityState;
}

// Selector functions
const getOpportunityFeatureState = createFeatureSelector<State, OpportunityState>(featureKey);

export const getOpportunities = createSelector(
    getOpportunityFeatureState,
    // state => state.opportunities
    state => {
      return state.opportunities.slice().sort((a: OpportunityResponse, b: OpportunityResponse) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    }
);

export const getOpportunitiesLoading = createSelector(
  getOpportunityFeatureState,
  state => state.opportunitiesLoading
);

export const getOpportunitiesFilter = createSelector(
  getOpportunityFeatureState,
  state => state.opportunitiesFilter
);

export const getOpportunity = createSelector(
  getOpportunityFeatureState,
  state => state.opportunity
);

export const getActivities = createSelector(
  getOpportunityFeatureState,
  state => state.activities
);

export const getActivity = createSelector(
  getOpportunityFeatureState,
  state => state.activity
);

export const getActivityMessage = createSelector(
  getOpportunityFeatureState,
  state => state.activityMessage
);

export const getFiles = createSelector(
  getOpportunityFeatureState,
  state => state.files
);
