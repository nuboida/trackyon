import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AppState from '../../../state/app.state';
import { CallMemoResponse } from '../models/call-memo-response.model';
import { CallMemoState, featureKey } from './call-memo.reducer';

export interface State extends AppState.State {
  callMemo: CallMemoState;
}

// Selector functions
const getCallMemoFeatureState = createFeatureSelector<State, CallMemoState>(featureKey);

export const getCallMemos = createSelector(
    getCallMemoFeatureState,
    state => state.callMemos
);

export const getStaffMemos = createSelector(
  getCallMemoFeatureState,
  state => state.staffMemos.slice().sort((a: CallMemoResponse, b: CallMemoResponse) => new Date(b.assignmentDate).getTime() - new Date(a.assignmentDate).getTime())
);

export const getStaffPersonalMemos = createSelector(
  getCallMemoFeatureState,
  state => state.staffPersonalMemos
);

export const getStaffMemosLoading = createSelector(
  getCallMemoFeatureState,
  state => state.staffMemosLoading
);

export const getDeptMemosLoading = createSelector(
  getCallMemoFeatureState,
  state => state.deptMemosLoading
);

export const getMemoDetailsLoading = createSelector(
  getCallMemoFeatureState,
  state => state.memoTaskDetailsLoading
);

export const getMemoTaskDetails = createSelector(
  getCallMemoFeatureState,
  state => state.memoTaskDetails
);
