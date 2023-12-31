import { ActivityResponse, FileUploadResponse, OpportunityFilter, OpportunityItemResponse, OpportunityResponse } from '@app/models/opportunity.model';
import { Action, createReducer, on } from '@ngrx/store';
import {  OpportunityItemApiActions, OpportunityItemPageActions, OpportunityListApiActions, OpportunityListPageActions } from './actions';

export interface OpportunityState {
  opportunities: OpportunityResponse[];
  opportunitiesLoading: boolean;
  opportunitiesFilter: OpportunityFilter;
  opportunity: OpportunityItemResponse;
  activities: ActivityResponse[];
  files: FileUploadResponse[];
  activity: ActivityResponse;
  activityMessage: string;
}

const initialFilter: OpportunityFilter = {
  option: 0,
  clientId: '',
  staffId: '',
  year: 2021,
  half: 1,
  quarter: 1,
  openClose: 1,
  month: 1,
  week: 1
};

export const initialState: OpportunityState = {
  opportunities: [],
  opportunitiesLoading: false,
  opportunitiesFilter: {...initialFilter},
  opportunity: {
    id: '',
    sellingPrice: 0,
    createdDate: new Date(),
    name: '',
    stage: '',
    stagePercentage: 0,
    stageId: 0,
    client: '',
    staff: '',
    description: '',
    expectedClosingDate: new Date(),
    businessType: '',
    clientContact: '',
    quantity: 0,
    costPrice: 0,
    otherFees: 0,
    margin: 0,
    rate: 0,
    amountPaid: 0,
    datePaymentReceived: new Date(),
    invoiceNumber: '',
    dateOfDelivery: new Date(),
    deliveryStatus: '',
    saleTeam: [{name: ''}],
    oems: [{name: ''}],
    training: '',
    oemNames: '',
    teamNames: ''
  },
  activities: [],
  files: [],
  activity: {
    activityId: 0,
    dateCreated: new Date(),
    isClosed: false,
    nextAction: '',
    opportunity: '',
    proposedDate: new Date(),
    opportunityStage: '',
    staff: ''
  },
  activityMessage: ''
};

export const featureKey = 'opportunities';

const opportunityReducer = createReducer(
  initialState,
  on(OpportunityListPageActions.loadOpportunities, state => ({...state, opportunitiesLoading: true})),
  on(OpportunityListPageActions.loadClientOpportunities, state => ({...state, opportunitiesLoading: true})),
  on(OpportunityListPageActions.loadMainStaffOpportunities, state => ({...state, opportunitiesLoading: true})),
  on(OpportunityListPageActions.loadYearOpportunities, state => ({...state, opportunitiesLoading: true})),
  on(OpportunityListPageActions.loadMonthOpportunities, state => ({...state, opportunitiesLoading: true})),
  on(OpportunityListPageActions.loadDaterangeOpportunities, state => ({...state, opportunitiesLoading: true})),
  on(OpportunityListPageActions.loadHalfYearOpportunities, state => ({...state, opportunitiesLoading: true})),
  on(OpportunityListPageActions.loadQuarterOpportunities, state => ({...state, opportunitiesLoading: true})),
  on(OpportunityListPageActions.loadYearOpenOpportunities, state => ({...state, opportunitiesLoading: true})),
  on(OpportunityListPageActions.loadYearClosedOpportunities, state => ({...state, opportunitiesLoading: true})),
  on(OpportunityListApiActions.loadOpportunitiesSuccess, (state, action) => (
    { ...state, opportunities: action.opportunities, opportunitiesLoading: false})),
  on(OpportunityListApiActions.loadOpportunitiesFailure, state => ({...state, opportunities: [], opportunitiesLoading: false})),
  on(OpportunityListPageActions.resetFilter, state => ({...state, opportunitiesFilter: { ...initialFilter}})),
  on(OpportunityItemApiActions.loadOpportunitySuccess, (state, action) => (
    { ...state, opportunity: action.opportunity})),
  on(OpportunityItemApiActions.loadOpportunityFailure, state => ({...state, opportunity: state.opportunity})),
  on(OpportunityItemApiActions.loadActivitiesSuccess, (state, action) => (
    { ...state, activities: action.activities, activityMessage: ''})),
  on(OpportunityItemApiActions.loadActivitiesFailure, state => ({...state, activities: [], activityMessage: ''})),
  on(OpportunityItemApiActions.loadActivitySuccess, (state, action) => (
    { ...state, activity: action.activity, activityMessage: ''})),
  on(OpportunityItemApiActions.loadActivityFailure, state => ({...state, activity: state.activity, activityMessage: ''})),
  on(OpportunityItemPageActions.clearActivity, state => ({...state, activity: state.activity, activityMessage: ''})),
  on(OpportunityItemApiActions.createUpdateActivitySuccess, state => (
    { ...state, activityMessage: 'Success'})),
  on(OpportunityItemApiActions.createUpdateActivityFailure, state => ({...state, activityMessage: 'Failed'})),
  on(OpportunityItemApiActions.loadOpportunityFilesSuccess, (state, action) => (
    { ...state, files: action.files })),
  on(OpportunityItemApiActions.loadOpportunityFilesFailure, state => ({ ...state, files: [] })),
);

export function reducer(state: OpportunityState | undefined, action: Action): OpportunityState {
  return opportunityReducer(state, action);
}
