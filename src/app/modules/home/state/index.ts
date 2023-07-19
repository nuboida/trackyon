import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AppState from '../../../state/app.state';
import { DashboardState, featureKey } from './dashboard.reducer';

export interface State extends AppState.State {
  dashboard: DashboardState;
}

// Selector functions
const getDashboardFeatureState = createFeatureSelector<State, DashboardState>(featureKey);

export const getClients = createSelector(
    getDashboardFeatureState,
    state => state.clients
);

export const getStats = createSelector(
  getDashboardFeatureState,
  state => state.stats
);

export const getStages = createSelector(
  getDashboardFeatureState,
  state => state.stages
);

export const getSales = createSelector(
  getDashboardFeatureState,
  state => state.sales
);

export const getOpportunities = createSelector(
  getDashboardFeatureState,
  state => state.opportunities
);

export const getMonthlySales = createSelector(
  getDashboardFeatureState,
  state => state.monthlySales
);
