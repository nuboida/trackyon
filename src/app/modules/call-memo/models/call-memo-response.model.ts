interface CallMemoResponse {
  callMemoId: string;
  memoActivities: CallMemoActivity[];
  staff: string;
  assignmentDate: Date;
  isClosed: boolean;
}

interface CallMemoActivity {
  memoActivityId: number;
  memoProject: string;
  memoTask: string;
  assignmentNote: string;
  assignmentStartTime: Date;
  assignmentEndTime: Date;
  memoTaskId: number;
  memoProjectId: number;
  duration?: string;
}

interface MemoTaskDetailsResponse {
  weight: number;
  id: number;
  score: number;
  scoreDate: string;
  comment: string;
  notes: string;
  detailsDate: string;
  memoTaskId: number;
  departmentId: number;
  companyId: string;
}

interface MemoTaskDetailRequest {
  score: number;
  comment: string;
  notes: string;
  detailsDate: string | Date;
  memoTaskId: number,
  departmentId: number;
  companyId: string;
}

interface UpdateScoreRequest {
  id: number;
  score: number;
  weight: number;
  scoreDate?: string | Date;
  comment: string;
}

interface EditTaskDetailRequest {
  id: number;
  score: number;
  comment: string;
  notes: string;
}

interface DetailSubmitResponse {
  message: string;
  status: true
}

export {
  CallMemoResponse,
  CallMemoActivity,
  MemoTaskDetailsResponse,
  MemoTaskDetailRequest,
  DetailSubmitResponse,
  EditTaskDetailRequest,
  UpdateScoreRequest
};
