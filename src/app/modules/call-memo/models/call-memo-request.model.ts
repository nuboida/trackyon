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

export { CallMemoFilterRequest, CallMemoPersonalFilterRequest, CallDeptMemoFilterRequest };
