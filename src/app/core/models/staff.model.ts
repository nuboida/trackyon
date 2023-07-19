export interface StaffCreateRequest {
  firstName: string;
  lastName: string;
  department: string;
  email: string;
  phoneNumber: string;
  password: string;
  systemRole: string[];
  officeRole: string;
  address?: string;
  target: number;
  birthDate: string;
  dateOfResumption: string;
  grade: string;
}

export interface StaffUpdateRequest extends StaffCreateRequest {
  staffId: string;
}

export interface StaffResponse {
  staffId: string;
  firstName: string;
  lastName: string;
  department: string;
  departmentId: number;
  email: string;
  phone: string;
  officeRole: string;
  systemRoles: string[];
  cloudinaryUrl: string;
  active: string;
  address?: string;
  target: number;
  birthDate: string;
  dateOfResumption: string;
  grade: string;
}

export interface RoleResponse {
  roleId: string;
  name: string;
}

export interface ChangePictureRequest {
  staffId: string;
  image: File;
}
