export interface OpportunityCreateRequest {
  companyId: string;
  staffId: string;
  name: string;
  opportunityStageId: number;
  clientId: string;
  clientContactId: number;
  opportunityClassificationId: number;
  businessTypeId: number;
  description: string;
  oemIds?: string[];
  quantity?: number;
  costPrice?: number;
  sellingPrice?: number;
  training?: number;
  otherFees?: number;
  opportunityTeam?: string[];
  amountPaid?: number;
  rate?: number;
  invoiceNumber?: string;
  datePaymentReceived?: Date | string;
  deliveryStatusId?: number;
  dateOfDelivery?: Date | string;
}

export interface OpportunityUpdateRequest extends OpportunityCreateRequest {
  opportunityId: string;
}

export interface ActivityCreateRequest {
  nextAction: string;
  dateCreated: Date | string;
  staffId: string;
  proposedDate: Date | string;
  isClosed: boolean;
  opportunityId: string;
  opportunityStageId: number;
  companyId: string;
}

export interface OpportunityResponse {
  id: string;
  createdDate: string | Date;
  sellingPrice: number;
  name: string;
  stage: string;
  client: string;
  staff: string;
  age: number;
  fiscalPeriod: string;
  percentage: number;
  closeDate: Date | string;
  nextStep: string;
  businessType: string;
  quantity: number;
  costPrice: number;
  otherFees: number;
  margin: number;
  rate: number;
  amountPaid: number;
  datePaymentReceived: Date | string;
  invoiceNumber: string;
  dateOfDelivery: Date | string;
  deliveryStatus: string;
  saleTeam: [{
      name: string
    }
  ];
  oems: [{
      name: string
    }
  ];
  training: number;
}

export interface OpportunityOption {
  id: string;
  name: string;
}

export interface OpportunityItemResponse {
  id: string;
  createdDate: Date;
  sellingPrice: number;
  name: string;
  stage: string;
  stagePercentage: number;
  stageId: number;
  client: string;
  staff: string;
  description: string;
  expectedClosingDate: Date;
  businessType: string;
  clientContact: string;
  quantity: number;
  costPrice: number;
  otherFees: number;
  margin: number;
  rate: number;
  amountPaid: number;
  datePaymentReceived: Date;
  invoiceNumber: string;
  dateOfDelivery: Date;
  deliveryStatus: string;
  saleTeam: [
    {
      name: string
    }
  ];
  oems: [
    {
      name: string
    }
  ];
  training: string;
  oemNames: string;
  teamNames: string;
}

export interface OpportunityFilter {
  option: number;
  clientId: string;
  staffId: string;
  year: number;
  half: number;
  quarter: number;
  openClose: number;
  month: number;
  week: number;
}

export interface FilterByOpportunityStage {
  value: number;
}

export interface ActivityResponse {
  activityId: number;
  dateCreated: Date;
  isClosed: boolean;
  nextAction: string;
  opportunity: string;
  proposedDate: Date;
  opportunityStage: string;
  staff: string;
}

export interface ActivityListRequest {
  opportunityId: string;
  companyId: string;
}

export interface ActivityItemRequest {
  opportunityId: string;
  activityId: number;
  companyId: string;
}

export interface Stage {
  opportunityStageId: number;
  name: string;
  percentage: number;
}

export interface BusinessType {
  businessTypeId: number;
  type: string;
}

export interface StageUpdateRequest {
  opportunityId: string;
  opportunityStageId: number;
}

export interface ClassificationRequest {
  name: string;
  companyId: string;
}

export interface ClassificationResponse {
  name: string;
  opportunityClassificationId: number;
}

export interface DeliveryStatusResponse {
  deliveryStatusId: number;
  name: string;
}

export interface FileUploadRequest {
  opportunityId: string;
  files: File[];
}

export interface FileUploadResponse {
  opportunityFileId: 0;
  fileName: string;
  dateCreated: string;
  staff: string;
  url: string;
}

export interface ClientFilterRequest {
  clientId: string;
  date: string | Date;
}

export interface DateRangeFilterRequest {
  startTime: string | Date;
  endTime: string | Date;
}
