export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  phoneNumber: string;
  companyId: string;
  roles: string[];
  staffImageUrl: string;
  companyLogoUrl: string;
  companyName: string;
  department: string;
  departmentId: string;
  position: string;
  verified: boolean;
  passwordChanged: boolean;
}

export interface RegisterRequest {
  name: string;
  userFirstName: string;
  userLastName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  logo: File | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  token?: string;
}

export interface CompanyResponse {
  logo: string;
  name: string;
}

