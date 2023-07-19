import { ClientFilterRequest, DateRangeFilterRequest } from '@app/models/opportunity.model';
import { createAction, props } from '@ngrx/store';

export const loadOpportunities = createAction('[Opportunity List Page] Load Opportunities');

export const loadClientOpportunities = createAction('[Opportunity List Page] Load Client Opportunities',
props<{ request: ClientFilterRequest  }>());

export const loadYearOpportunities = createAction('[Opportunity List Page] Load Year Opportunities',
props<{ year: number }>());

export const loadHalfYearOpportunities = createAction('[Opportunity List Page] Load Half Year Opportunities',
props<{ year: number, half: number }>());

export const loadQuarterOpportunities = createAction('[Opportunity List Page] Load Quarter Opportunities',
props<{ year: number, quarter: number }>());

export const loadMainStaffOpportunities = createAction('[Opportunity List Page] Load Main Staff Opportunities',
props<{staffId: string}>()
);

export const loadYearOpenOpportunities = createAction('[Opportunity List Page] Load Year Open Opportunities',
props<{ year: number }>());

export const loadYearClosedOpportunities = createAction('[Opportunity List Page] Load Year Closed Opportunities',
props<{ year: number }>());

export const loadMonthOpportunities = createAction('[Opportunity List Page] Load Month Opportunities',
props<{year: number, month: number}>());

export const loadDaterangeOpportunities = createAction('[Opportunity List Page] Load Daterange Opportunities',
props<{request: DateRangeFilterRequest}>());

export const resetFilter = createAction('[Opportunity List Page] Reset Filter');
