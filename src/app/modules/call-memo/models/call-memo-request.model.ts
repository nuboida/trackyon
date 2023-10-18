class CallMemoRequest {
}

interface CallMemoPersonalFilterRequest {
  staffId: string;
  startTime: string | Date;
  endTime: string | Date;
}

interface CallMemoFilterRequest {
  staffs: string[];
  startTime: string | Date;
  endTime: string | Date;
}

interface CallDeptMemoFilterRequest {
  departmentId: string;
  startTime: string | Date;
  endTime: string | Date;
}
interface CallStaffMemoFilterRequest {
  staffId: string;
  startTime: string | Date;
  endTime: string | Date;
}

interface CallStaffMemoDetailFilterRequest {
  staffId: string;
  startTime: string | Date;
  endTime: string | Date;
}

interface TaskDeptMemoFilterRequest {
  staffId: string;
  startTime: string | Date;
  endTime: string | Date;
}

export { CallMemoFilterRequest, CallMemoPersonalFilterRequest, CallDeptMemoFilterRequest, CallStaffMemoFilterRequest, CallStaffMemoDetailFilterRequest, TaskDeptMemoFilterRequest };
