import { CallMemoDisplay, CallMemoResponse } from '@app/models/call-memo.model';
import { CallMemoCalendar } from '@modules/call-memo/models/call-memo-display.model';
import { MemoTaskDetailsResponse, MemoTaskStaffDetailsResponse } from '@modules/call-memo/models/call-memo-response.model';
import { createAction, props } from '@ngrx/store';

export const loadCallMemosSuccess = createAction(
  '[Call Memo API] Load Call Memos Success',
  props<{ callMemos: CallMemoCalendar[] }>()
);

export const loadCallMemosFailure = createAction(
  '[Call Memo API] Load Call Memos Failure'
);

export const loadStaffCallMemosSuccess = createAction(
  '[Call Memo API] Load Staff Call Memos Success',
  props<{ callMemos: CallMemoResponse[] }>()
);

export const loadStaffCallMemosFailure = createAction(
  '[Call Memo API] Load Staff Call Memos Failure'
);

export const loadPersonalStaffMemoSuccess = createAction(
  '[Call Memo API] Load Personal Staff Memo Success',
  props<{ callMemos: CallMemoResponse[] }>()
);

export const loadPersonalStaffMemoFailure = createAction(
  '[Call Memo API] Load Personal Staff Memo Failure'
);

export const loadFilteredMemosSuccess = createAction(
  '[Call Memo API] Load Filtered Memos Success',
  props<{ callMemos: CallMemoResponse[] }>()
);

export const loadFilteredMemosFailure = createAction(
  '[Call Memo API] Load Filtered Memos Failure'
);

export const loadFilteredDeptMemosSuccess = createAction(
  '[Call Dept Memo API] Load Filtered Dept Memos Success',
  props<{ callDeptMemos: CallMemoResponse[] }>()
);

export const loadFilteredDeptMemosFailure = createAction(
  '[Call Dept Memo API] Load Filtered Dept Memos Failure'
);

export const getMemoTasksSuccess = createAction(
  '[Call Memo Tasks Details API] Load Memo Tasks Details Success',
  props<{ memoDetails: MemoTaskDetailsResponse[] }>()
)

export const getMemoTasksFailure = createAction(
  '[Call Memo Tasks Details API] Load Memo Tasks Details Failure'
)
export const getMemoTaskStaffSuccess = createAction(
  '[Call Memo Staff Tasks Details API] Load Memo Staff Tasks Details Success',
  props<{ memoDetails: MemoTaskStaffDetailsResponse[] }>()
)

export const getMemoTaskStaffFailure = createAction(
  '[Call Memo Staff Tasks Details API] Load Memo Staff Tasks Details Failure'
)
