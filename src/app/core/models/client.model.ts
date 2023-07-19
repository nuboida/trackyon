export interface ClientCreateRequest {
  name: string;
  isProspective: boolean;
  companyId: string;
}

export interface ClientResponse {
  name: string;
  isProspective: boolean;
  clientId: string;
}

export interface ClientContactCreateRequest {
  name: string;
  phone: string;
  email: string;
  position: string;
  clientId: string;
}

export interface ClientContactResponse {
  clientContactId: number;
  name: string;
  phone: string;
  email: string;
  position: string;
}
