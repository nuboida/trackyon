import { CallMemoDisplay, CallMemoResponse } from '@app/models/call-memo.model';
import { Action, createReducer, on } from '@ngrx/store';
import { CallMemoCalendar } from '../models/call-memo-display.model';
import { MemoTaskDetailsResponse, MemoTaskStaffDetailsResponse } from '../models/call-memo-response.model';
import {  CallMemoApiActions, CallMemoPageActions } from './actions';

const defaultData: CallMemoDisplay[] = [
  {
      Id: '1',
      Subject: 'Conference',
      StartTime: new Date(2021, 0, 7, 10, 0),
      EndTime: new Date(2021, 0, 7, 11, 0),
  }, {
      Id: '2',
      Subject: 'Meeting - 1',
      StartTime: new Date(2021, 0, 15, 1, 0),
      EndTime: new Date(2021, 0, 15, 22, 30),
  }, {
      Id: '3',
      Subject: 'Paris',
      StartTime: new Date(2021, 0, 13, 12, 0),
      EndTime: new Date(2021, 0, 13, 12, 30),
  }, {
      Id: '4',
      Subject: 'Vacation',
      StartTime: new Date(2021, 0, 12, 10, 0),
      EndTime: new Date(2021, 0, 12, 10, 30),
  }
];

export interface CallMemoState {
  callMemos: CallMemoCalendar[];
  staffMemos: CallMemoResponse[];
  staffPersonalMemos: CallMemoResponse[];
  deptMemos: CallMemoResponse[];
  staffMemosLoading: boolean;
  deptMemosLoading: boolean;
  memoTaskDetailsLoading: boolean;
  memoTaskStaffDetailsLoading: boolean;
  memoTaskDetails: MemoTaskDetailsResponse[];
  memoTaskStaffDetails: MemoTaskStaffDetailsResponse[];
}

const initialState: CallMemoState = {
  callMemos: [],
  staffMemos: [],
  staffPersonalMemos: [],
  deptMemos: [],
  staffMemosLoading: false,
  deptMemosLoading: false,
  memoTaskDetailsLoading: false,
  memoTaskStaffDetailsLoading: false,
  memoTaskDetails: [],
  memoTaskStaffDetails: []
};

export const featureKey = 'callMemo';

const callMemoReducer = createReducer(
  initialState,
  on(CallMemoApiActions.loadCallMemosSuccess, (state, action) =>
  ({ ...state, callMemos: action.callMemos})),

  on(CallMemoApiActions.loadCallMemosFailure, state => ({...state, callMemos: []})),

  on(CallMemoPageActions.loadStaffMemos, state  => ({ ...state, staffMemosLoading: true})),

  on(CallMemoPageActions.loadFilteredMemos, state  => ({ ...state, staffMemosLoading: true})),

  on(CallMemoPageActions.loadFilteredDeptMemos, state  => ({ ...state, deptMemosLoading: true})),

  on(CallMemoApiActions.loadStaffCallMemosSuccess, (state, action) =>
  ({ ...state, staffMemos: action.callMemos, staffMemosLoading: false})),

  on(CallMemoApiActions.loadStaffCallMemosFailure, state =>
    ({...state, staffMemos: [], staffMemosLoading: false})),

  on(CallMemoApiActions.loadPersonalStaffMemoSuccess, (state, action) =>
  ({ ...state, staffPersonalMemos: action.callMemos, staffMemosLoading: false})),

  on(CallMemoApiActions.loadPersonalStaffMemoFailure, state =>
    ({...state, staffPersonalMemos: [], staffMemosLoading: false})),

  on(CallMemoApiActions.loadFilteredMemosSuccess, (state, action) =>
  ({ ...state, staffMemos: action.callMemos, staffMemosLoading: false})),

  on(CallMemoApiActions.loadFilteredMemosFailure, state =>
    ({...state, staffMemos: [], staffMemosLoading: false})),

  on(CallMemoApiActions.loadFilteredDeptMemosSuccess, (state, action) =>
  ({ ...state, deptMemos: action.callDeptMemos, deptMemosLoading: false})),

  on(CallMemoApiActions.loadFilteredDeptMemosFailure, state =>
    ({...state, deptMemos: [], deptMemosLoading: false})),

  on(CallMemoPageActions.loadMemoTasksDetails, state => ({...state, memoTaskDetailsLoading: true})),

  on(CallMemoApiActions.getMemoTasksSuccess, (state, action) =>
    ({...state, memoTaskDetails: action.memoDetails, memoTaskDetailsLoading: false})),

  on(CallMemoApiActions.getMemoTasksFailure, state => (
    {...state, memoTaskDetails: [], memoTaskDetailsLoading: false}
  )),
  on(CallMemoPageActions.loadMemoTaskStaffDetails, state => ({...state, memoTaskDetailsLoading: true})),

  on(CallMemoApiActions.getMemoTaskStaffSuccess, (state, action) =>
    ({...state, memoTaskStaffDetails: action.memoDetails, memoTaskStaffDetailsLoading: false})),

  on(CallMemoApiActions.getMemoTaskStaffFailure, state => (
    {...state, memoTaskStaffDetails: [], memoTaskStaffDetailsLoading: false}
  ))
);

export function reducer(state: CallMemoState | undefined, action: Action): CallMemoState {
  return callMemoReducer(state, action);
}
