export class AuthRoutes {
  static Login = 'auth/login';
  static Register = 'company/create';
  static ForgotPassword = 'auth/forgot-password';
  static ResetPassword = 'auth/reset-password';
  static ChangePassword = 'auth/change-password';
  static VerifyEmail = 'auth/verify-email';
  static SendVerification = 'auth/send-verify-email';
  static GetCompany = 'company/name/companyName';
}

export class ClientRoutes {
  static CreateClient = 'client/create';
  static GetClient = 'client/clientId';
  static CreateClientContact = 'client/create/contact';
  static CompanyClients = 'client/all/company/companyId';
  static ListClientContacts = 'client/clientId/contacts';
}

export class OemRoutes {
  static CreateOem = 'oem/create';
  static GetOem = 'oem/oemId';
  static ListOemContacts = 'oem/oemId/contacts';
  static CreateOemContact = 'oem/create/contact';
  static CompanyOems = 'oem/all/companyId';
}

export class OpportunityRoutes {
  static CreateOpportunity = 'opportunity/add';
  static CreateActivity = 'opportunity/activity/add';
  static ListOpportunity = 'opportunity/companyId/all/staffId';
  static GetOpportunity = 'opportunity/opportunityId';
  static ListActivity = 'opportunity/activity/all';
  static GetActivity = 'opportunity/activity/open';
  static CloseActivity = 'opportunity/activity/close/activityId';
  static UpdateActivity = 'opportunity/activity/update';
  static ListStage = 'dbSeed/sale-stages';
  static UpdateStage = 'opportunity/stage/update';
  static ListBusinessType = 'dbSeed/business-type';
  static ListClassification = 'opportunityclassifications/all/companyId';
  static CreateClassification = 'opportunityclassifications/add';
  static EditClassification = 'opportunityclassifications/classification/edit';
  static GetOpportunityByClient = 'opportunity/client/clientId/staffId/activityDate';
  static GetOpportunityByQuarter = 'opportunity/companyId/filter-quarter/year/Quarter/staffId';
  static GetOpportunityByHalf = 'opportunity/companyId/filter-half/year/Half/staffId';
  static GetOpportunityByYear = 'opportunity/companyId/filter-year/Year/staffId';
  static GetOpportunityByMonth = 'opportunity/companyId/filter-month/Year/Month/staffId';
  static GetOpportunityByDaterange = 'opportunity/companyId/filter-date/startDate/endDate/staffId';
  static GetOpportunityOpen = 'opportunity/companyId/filter-year/Year/open/staffId';
  static GetOpportunityClosed = 'opportunity/companyId/filter-year/Year/closed/staffId';
  static GetOpportunityWon = 'opportunity/won/staffId';
  static ListDeliveryStatus = 'dbseed/delivery-status';
  static EditOpportunity = 'opportunity/edit/opportunityId';
  static UploadOpportunityDoc = 'opportunity/file/add';
  static GetOpportunityDoc = 'opportunity/files/opportunityId';
  static GetOpportunityMainStaff = 'opportunity/companyId/user/staffId';
}

export class StaffRoutes {
  static CreateStaff = 'staff/companyId/create';
  static UpdateStaff = 'staff/update';
  static GetStaff = 'staff/staffId';
  static CompanyStaffs = 'staff/all/companyId';
  static ListRole = 'dbSeed/roles';
  static ChangePicture = 'staff/picture/staffId';
  static DeactivateStaff = 'staff/deactivate/staffId';
  static ActivateStaff = 'staff/activate/staffId';
}

export class CallMemoRoutes {
  static CreateCallMemo = 'callmemo/add';
  static GetCallMemo = 'callmemo/activities/date';
  static ListStaffCallMemo = 'callmemo/staff/staffId';
  static CloseCallMemo = 'callmemo/close/date';
  static ListProject = 'callmemo/projects/companyId';
  static CreateProject = 'callmemo/project/create';
  static EditProject = 'callmemo/project/edit';
  // static ListTask = 'callmemo/tasks/companyId';
  static ListTask = 'callmemo/tasks/companyId/departmentId';
  static ListTaskByStaff = 'callmemo/tasks/staff/staffId';
  static CreateTask = 'callmemo/task/create';
  static EditTask = 'callmemo/task/edit';
  static UpdateCallMemoActivity = 'callmemo/memo/activity/edit';
  static RemoveCallMemoActivity = 'callmemo/memo/delete/callMemoId/staffId/activityId';
  static StaffMemoList = 'report/companyId/call-memo/staffId';
  static PersonalMemoList = 'report/companyId/staff/call-memo';
}

export class DepartmentRoutes {
  static ListDepartment = 'Department/departments/companyId';
  static CreateDepartment = 'Department/department/create'
  static EditDepartment = 'Department/department/edit'
}
