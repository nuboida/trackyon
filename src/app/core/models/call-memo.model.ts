export interface CallMemoRequest {
  companyId: string;
  staffId: string;
  memoProjectId: number;
  memoTaskId: number;
  assignmentNote: string;
  assignmentStartTime: string | Date;
  assignmentEndTime: string | Date;
}

export interface CallMemoDisplay {
  Id: string;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
}

export interface CallMemoResponse {
  callMemoId: string;
  memoActivities: CallMemoActivity[];
  staff: string;
  assignmentDate: Date;
  isClosed: boolean;
}

export interface CallMemoActivity {
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

export interface CallMemoUpdateRequest {
  callMemoId: string;
  callMemoActivityId: number;
  staffId: string;
  memoProjectId: number;
  memoTaskId: number;
  assignmentNote: string;
  assignmentStartTime: string | Date;
  assignmentEndTime: string | Date;
}

export interface CallMemoActivityTable {
  id: number;
  project: string;
  projectId: number;
  task: string;
  taskId: number;
  starttime: string;
  endtime: string;
  notes: string;
  duration: string;
}

export interface CallMemoFilterRequest {
  staffs: string[];
  startTime: string | Date;
  endTime: string | Date;
}

export interface CallMemoPersonalFilterRequest {
  staffId: string;
  startTime: string | Date;
  endTime: string | Date;
}

export interface ProjectRequest {
  name: string;
  companyId: string;
}

export interface ProjectResponse {
  name: string;
  memoProjectId: number;
}

export interface TaskRequest {
  name: string;
  departmentId: number;
  weight: number;
  frequency: string;
  criteria: string;
  dimensions: string;
  kra: string;
}

export interface CreateNewTaskRequest extends TaskRequest {
  companyId: string;
}

export interface EditTask {
  id: number;
  name: string;
  departmentId: string;
  weight: number;
  frequency: string;
  criteria: string;
  dimensions: string;
  kra: string;
  staffId: string[],
  target: string
}

export interface TaskResponse {
  name: string;
  memoTaskId: number;
  departmentId: string;
  criteria: string;
  dimensions: string;
  frequency: string;
  kra: string;
  weight: number;
}
