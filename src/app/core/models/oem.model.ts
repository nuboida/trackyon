export interface OemCreateRequest {
  name: string;
  companyId: string;
}

export interface OemContactCreateRequest {
  name: string;
  phone: string;
  email: string;
  isMain: boolean;
  oemId: string;
}

export interface OemResponse {
  oemId: string;
  name: string;
}

export interface OemContactResponse {
  oemContactId: number;
  name: string;
  phone: string;
  email: string;
  isMain: boolean;
}
