import { DashboardOpportunity, DashboardSale, DashboardStageVM, DashboardStat } from '@modules/home/dashboard.model';
import { createAction, props } from '@ngrx/store';

export const loadClientsSuccess = createAction(
  '[Dashboard API] Load Clients Success',
  props<{ clients: number[] }>()
);

export const loadClientsFailure = createAction(
  '[Dashboard API] Load Clients Failure'
);

export const loadOpportunitesSuccess = createAction(
  '[Dashboard API] Load Opportunities Success',
  props<{ opportunities: DashboardOpportunity[] }>()
);

export const loadOpportunitiesFailure = createAction(
  '[Dashboard API] Load Opportunities Failure'
);

export const loadSalesSuccess = createAction(
  '[Dashboard API] Load Sales Success',
  props<{ sales: DashboardSale[] }>()
);

export const loadSalesFailure = createAction(
  '[Dashboard API] Load Sales Failure'
);

export const loadStatsSuccess = createAction(
  '[Dashboard API] Load Stats Success',
  props<{ stats: DashboardStat }>()
);

export const loadStatsFailure = createAction(
  '[Dashboard API] Load Stats Failure'
);

export const loadStagesSuccess = createAction(
  '[Dashboard API] Load Stages Success',
  props<{ stages: DashboardStageVM }>()
);

export const loadStagesFailure = createAction(
  '[Dashboard API] Load Stages Failure'
);

export const loadMonthlySalesSuccess = createAction(
  '[Dashboard API] Load Monthly Sales Success',
  props<{ monthlySales: number[] }>()
);

export const loadMonthlySalesFailure = createAction(
  '[Dashboard API] Load Monthly Sales Failure'
);

export const loadSalesStaffSuccess = createAction(
  '[Dashboard API] Load Sales Staff success',
);
