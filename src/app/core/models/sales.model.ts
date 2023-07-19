export class SalesCreateRequest {
  nameOfService: string;
  quantity: number;
  requestDate: string;
  requestedDate: Date;
  costPrice: number;
  sellingPrice: number;
  otherFees: number;
  margin: number;
  rate: number;
  amountPaid: number;
  dateMoneyReceived: string;
  dateReceived: Date;
  invoiceNumber: string;
  dateOfDelivery: string;
  dateDelivery: Date;
  deliveryStatus: number;
  clientId: string;
  clientContactId: number;
  companyId: string;
  opportunityId?: string;
  staffId: string;
  saleTeams: string[];
  oemIds: string[];
  training: number;
}

export interface SalesResponse {
  salesId: string;
  nameOfService: string;
  quantity: number;
  requestDate: Date;
  costPrice: number;
  sellingPrice: number;
  otherFees: number;
  margin: number;
  rate: number;
  amountPaid: number;
  dateMoneyReceived: Date;
  invoiceNumber: string;
  dateOfDelivery: Date;
  deliveryStatus: boolean;
  client: string;
  clientContact: string;
  training: number;
}

export interface CurrencyResponse {
  currencyId: number;
  name: string;
}
