import { CallMemoFilterRequest, CallMemoPersonalFilterRequest } from '@app/models/call-memo.model';
import { CallDeptMemoFilterRequest, CallStaffMemoFilterRequest } from '@modules/call-memo/models/call-memo-request.model';
import { createAction, props } from '@ngrx/store';

export const loadCallMemos = createAction('[Call Memo Personal Page] Load Call Memos');

export const loadStaffMemos = createAction('[Call Memo Staff Page] Load Staff Call Memos');

export const loadPersonalStaffMemos = createAction('[Call Memo Personal Page] Load Personal Staff Call Memos',
props<{ request: CallMemoPersonalFilterRequest }>());

export const loadFilteredMemos = createAction('[Call Memo Staff Page] Load Filtered Memos',
props<{ request: CallMemoFilterRequest }>());

export const loadFilteredDeptMemos = createAction('[Call Memo Dept Page] Load Filtered Dept Memos',
props<{ request: CallDeptMemoFilterRequest }>());

export const loadMemoTasksDetails = createAction('[Call Memo Dept Page] Load Memo Tasks Details',
props<{request: CallDeptMemoFilterRequest }>()
);

export const loadMemoTaskStaffDetails = createAction('[Call Memo Staff Page] Load Memo Tasks Details',
props<{request: CallStaffMemoFilterRequest }>()
);
