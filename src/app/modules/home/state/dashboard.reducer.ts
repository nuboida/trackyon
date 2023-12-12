import { Action, createReducer, on } from '@ngrx/store';
import { DashboardOpportunity, DashboardSale, DashboardStageVM, DashboardStat } from '../dashboard.model';
import {  DashboardApiActions } from './actions';

export interface DashboardState {
  clients: number[];
  opportunities: DashboardOpportunity[];
  sales: DashboardSale[];
  stages: DashboardStageVM;
  stats: DashboardStat;
  monthlySales: number[];
}

const initialState: DashboardState = {
  clients: [],
  sales: [],
  stages: {
    data: [],
    colors: [],
    labels: []
  },
  stats: {
    clients: 0,
    contacts: 0,
    opportunities: 0,
    sales: 0
  },
  opportunities: [],
  monthlySales: []
};

export const featureKey = 'dashboard';

const dashboardReducer = createReducer(
  initialState,
  on(DashboardApiActions.loadClientsSuccess, (state, action) => ({ ...state, clients: action.clients})),
  on(DashboardApiActions.loadClientsFailure, state => ({...state, clients: []})),
  on(DashboardApiActions.loadOpportunitesSuccess, (state, action) => ({ ...state, opportunities: action.opportunities})),
  on(DashboardApiActions.loadOpportunitiesFailure, state => ({...state, opportunities: []})),
  on(DashboardApiActions.loadSalesSuccess, (state, action) => ({ ...state, sales: action.sales})),
  on(DashboardApiActions.loadSalesFailure, state => ({...state, sales: []})),
  on(DashboardApiActions.loadStatsSuccess, (state, action) => ({ ...state, stats: action.stats})),
  on(DashboardApiActions.loadStatsFailure, state => ({...state, stats: state.stats})),
  on(DashboardApiActions.loadStagesSuccess, (state, action) => ({ ...state, stages: action.stages})),
  on(DashboardApiActions.loadStagesFailure, state => ({...state, stages: state.stages})),
  on(DashboardApiActions.loadMonthlySalesSuccess, (state, action) => ({ ...state, monthlySales: action.monthlySales})),
  on(DashboardApiActions.loadMonthlySalesFailure, state => ({...state, monthlySales: []}))
);

export function reducer(state: DashboardState | undefined, action: Action): DashboardState {
  return dashboardReducer(state, action);
}
