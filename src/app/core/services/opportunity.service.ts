import { Injectable } from '@angular/core';
import { formatAPIDate } from '@app/helpers/date.helper';
import { OpportunityRoutes } from '@app/helpers/routes.helper';
import {
  ActivityCreateRequest, ActivityItemRequest, ActivityListRequest,
  ActivityResponse, BusinessType, ClassificationRequest, ClassificationResponse,
  ClientFilterRequest,
  DateRangeFilterRequest,
  DeliveryStatusResponse, FileUploadRequest, FileUploadResponse, OpportunityCreateRequest,
  OpportunityItemResponse, OpportunityOption, OpportunityResponse,
  OpportunityUpdateRequest, Stage, StageUpdateRequest
} from '@app/models/opportunity.model';
import { GlobalEdit, GlobalResponse } from '@app/models/response.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable()
export class OpportunityService {

  companyId!: string;
  staffId!: string;
  constructor(private api: ApiService, private auth: AuthService) {
    this.auth.user$.subscribe(
      user => {
        this.companyId = user?.companyId;
        this.staffId = user?.staffId;
      }
    );
  }

  createOpportunity(request: OpportunityCreateRequest): Observable<GlobalResponse> {
    request.companyId = this.companyId;
    request.staffId = this.staffId;
    request.dateOfDelivery = request.dateOfDelivery ?
            formatAPIDate(new Date(request.dateOfDelivery)) :
            request.dateOfDelivery;
    request.datePaymentReceived = request.datePaymentReceived ?
            formatAPIDate(new Date(request.datePaymentReceived)) :
            request.datePaymentReceived;
    return this.api.post<GlobalResponse>(OpportunityRoutes.CreateOpportunity, request);
  }

  createOpportunityActivity(request: ActivityCreateRequest): Observable<GlobalResponse> {
    request.companyId = this.companyId;
    request.staffId = this.staffId;
    request.dateCreated = formatAPIDate(new Date());
    request.proposedDate = formatAPIDate(new Date(request.proposedDate));
    request.isClosed = false;
    return this.api.post<GlobalResponse>(OpportunityRoutes.CreateActivity, request);
  }

  getOpportunities(): Observable<OpportunityResponse[]> {
    return this.api.get<OpportunityResponse[]>(OpportunityRoutes.ListOpportunity.replace('companyId', this.companyId)
    .replace('staffId', this.staffId))
    .pipe(
      map(x => {
        return x.map(s => {
          s.createdDate = new Date(s.createdDate);
          s.dateOfDelivery = new Date(s.dateOfDelivery);
          s.datePaymentReceived = new Date(s.datePaymentReceived);
          s.closeDate = new Date(s.closeDate);
          return s;
        });
      })
    );
  }

  getOpportunitiesWon(): Observable<OpportunityOption[]> {
    return this.api.get<OpportunityOption[]>(OpportunityRoutes.GetOpportunityWon.replace('staffId', this.staffId));
  }

  getOpportunity(opportunityId: string): Observable<OpportunityItemResponse> {
    return this.api.get<OpportunityItemResponse>(OpportunityRoutes.GetOpportunity.replace('opportunityId', opportunityId))
      .pipe(
        map(resp => {
          resp.oemNames = resp.oems.map(x => x.name).join(', ');
          resp.teamNames = resp.saleTeam.map(x => x.name).join(', ');
          return resp;
        })
      );
  }

  getOpportunitiesByClient(request: ClientFilterRequest): Observable<OpportunityResponse[]> {
    return this.api.get<OpportunityResponse[]>(OpportunityRoutes.GetOpportunityByClient.replace('clientId', request.clientId)
    .replace('staffId', this.staffId).replace('activityDate', (request.date).toString()))
    .pipe(
      map(x => {
        return x.map(s => {
          s.createdDate = new Date(s.createdDate);
          s.dateOfDelivery = new Date(s.dateOfDelivery);
          s.datePaymentReceived = new Date(s.datePaymentReceived);
          s.closeDate = new Date(s.closeDate);
          return s;
        });
      })
    );
  }

  getOpportunitiesMainStaff(staffId: string): Observable<OpportunityResponse[]> {
    return this.api.get<OpportunityResponse[]>(OpportunityRoutes.GetOpportunityMainStaff
      .replace('companyId', this.companyId).replace('staffId', staffId))
      .pipe(
        map(x => {
          return x.map(s => {
            s.createdDate = new Date(s.createdDate);
            s.dateOfDelivery = new Date(s.dateOfDelivery);
            s.datePaymentReceived = new Date(s.datePaymentReceived);
            s.closeDate = new Date(s.closeDate);
            return s;
          });
        })
      );
  }

  getOpportunitiesByQuarter(year: number, quarter: number): Observable<OpportunityResponse[]> {
    return this.api.get<OpportunityResponse[]>(OpportunityRoutes.GetOpportunityByQuarter
      .replace('companyId', this.companyId).replace('year', year.toString()).replace('Quarter', quarter.toString())
      .replace('staffId', this.staffId))
      .pipe(
        map(x => {
          return x.map(s => {
            s.createdDate = new Date(s.createdDate);
            s.dateOfDelivery = new Date(s.dateOfDelivery);
            s.datePaymentReceived = new Date(s.datePaymentReceived);
            s.closeDate = new Date(s.closeDate);
            return s;
          });
        })
      );
  }

  getOpportunitiesByHalf(year: number, half: number): Observable<OpportunityResponse[]> {
    return this.api.get<OpportunityResponse[]>(OpportunityRoutes.GetOpportunityByHalf
      .replace('companyId', this.companyId).replace('year', year.toString()).replace('Half', half.toString())
      .replace('staffId', this.staffId))
      .pipe(
        map(x => {
          return x.map(s => {
            s.createdDate = new Date(s.createdDate);
            s.dateOfDelivery = new Date(s.dateOfDelivery);
            s.datePaymentReceived = new Date(s.datePaymentReceived);
            s.closeDate = new Date(s.closeDate);
            return s;
          });
        })
      );
  }

  getOpportunitiesByYear(year: number): Observable<OpportunityResponse[]> {
    return this.api.get<OpportunityResponse[]>(OpportunityRoutes.GetOpportunityByYear
      .replace('companyId', this.companyId).replace('Year', year.toString())
      .replace('staffId', this.staffId))
      .pipe(
        map(x => {
          return x.map(s => {
            s.createdDate = new Date(s.createdDate);
            s.dateOfDelivery = new Date(s.dateOfDelivery);
            s.datePaymentReceived = new Date(s.datePaymentReceived);
            s.closeDate = new Date(s.closeDate);
            return s;
          });
        })
      );
  }

  getOpportunitiesByMonth(year: number, month: number): Observable<OpportunityResponse[]> {
    return this.api.get<OpportunityResponse[]>(OpportunityRoutes.GetOpportunityByMonth
      .replace('companyId', this.companyId).replace('Year', year.toString())
      .replace('Month', month.toString())
      .replace('staffId', this.staffId))
      .pipe(
        map(x => {
          return x.map(s => {
            s.createdDate = new Date(s.createdDate);
            s.dateOfDelivery = new Date(s.dateOfDelivery);
            s.datePaymentReceived = new Date(s.datePaymentReceived);
            s.closeDate = new Date(s.closeDate);
            return s;
          });
        })
      );
  }

  getOpportunitiesByDaterange(request: DateRangeFilterRequest): Observable<OpportunityResponse[]> {
    return this.api.get<OpportunityResponse[]>(OpportunityRoutes.GetOpportunityByDaterange
      .replace('companyId', this.companyId)
      .replace('startDate', (request.startTime).toString())
      .replace('endDate', (request.endTime).toString())
      .replace('staffId', this.staffId))
      .pipe(
        map(x => {
          return x.map(s => {
            s.createdDate = new Date(s.createdDate);
            s.dateOfDelivery = new Date(s.dateOfDelivery);
            s.datePaymentReceived = new Date(s.datePaymentReceived);
            s.closeDate = new Date(s.closeDate);
            return s;
          });
        })
      );
  }

  getOpenOpportunitiesByYear(year: number): Observable<OpportunityResponse[]> {
    return this.api.get<OpportunityResponse[]>(OpportunityRoutes.GetOpportunityOpen
      .replace('companyId', this.companyId).replace('Year', year.toString())
      .replace('staffId', this.staffId))
      .pipe(
        map(x => {
          return x.map(s => {
            s.createdDate = new Date(s.createdDate);
            s.dateOfDelivery = new Date(s.dateOfDelivery);
            s.datePaymentReceived = new Date(s.datePaymentReceived);
            s.closeDate = new Date(s.closeDate);
            return s;
          });
        })
      );
  }

  getClosedOpportunitiesByYear(year: number): Observable<OpportunityResponse[]> {
    return this.api.get<OpportunityResponse[]>(OpportunityRoutes.GetOpportunityClosed
      .replace('companyId', this.companyId).replace('Year', year.toString())
      .replace('staffId', this.staffId))
      .pipe(
        map(x => {
          return x.map(s => {
            s.createdDate = new Date(s.createdDate);
            s.dateOfDelivery = new Date(s.dateOfDelivery);
            s.datePaymentReceived = new Date(s.datePaymentReceived);
            s.closeDate = new Date(s.closeDate);
            return s;
          });
        })
      );
  }

  getOpportunityActivities(opportunityId: string): Observable<ActivityResponse[]> {
    const request: ActivityListRequest = {
      opportunityId,
      companyId: this.companyId
    };
    return this.api.post<ActivityResponse[]>(OpportunityRoutes.ListActivity, request);
  }

  getOpportunityActivity(opportunityId: string, activityId: number): Observable<ActivityResponse> {
    const request: ActivityItemRequest = {
      opportunityId, activityId,
      companyId: this.companyId
    };
    return this.api.post<ActivityResponse>(OpportunityRoutes.GetActivity, request);
  }

  closeActivity(activityId: number): Observable<GlobalResponse> {
    return this.api.get<GlobalResponse>(OpportunityRoutes.CloseActivity.replace('activityId', activityId.toString()));
  }

  updateActivity(activityId: number, date: Date, nextAction: string): Observable<GlobalResponse> {
    const proposedDate = date ? formatAPIDate(date) : date;
    const request = { activityId, proposedDate, staffId: this.staffId, nextAction};

    return this.api.post<GlobalResponse>(OpportunityRoutes.UpdateActivity, request);
  }

  getStages(): Observable<Stage[]> {
    return this.api.get<Stage[]>(OpportunityRoutes.ListStage);
  }

  getBusinessTypes(): Observable<BusinessType[]> {
    return this.api.get<BusinessType[]>(OpportunityRoutes.ListBusinessType);
  }

  updateStage(request: StageUpdateRequest): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(OpportunityRoutes.UpdateStage, request);
  }

  getClassifications(): Observable<ClassificationResponse[]> {
    return this.api.get<ClassificationResponse[]>(OpportunityRoutes.ListClassification.replace('companyId', this.companyId));
  }

  createClassification(name: string): Observable<GlobalResponse> {
    const request: ClassificationRequest = {
      name, companyId: this.companyId
    };
    return this.api.post<GlobalResponse>(OpportunityRoutes.CreateClassification, request);
  }

  editClassification(request: GlobalEdit): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(OpportunityRoutes.EditClassification, request);
  }

  getDeliveryStatuses(): Observable<DeliveryStatusResponse[]> {
    return this.api.get<DeliveryStatusResponse[]>(OpportunityRoutes.ListDeliveryStatus);
  }

  getOpportunityForEdit(opportunityId: string): Observable<OpportunityUpdateRequest> {
    return this.api.get<OpportunityUpdateRequest>(OpportunityRoutes.EditOpportunity.replace('opportunityId', opportunityId));
  }

  updateOpportunity(request: OpportunityUpdateRequest): Observable<GlobalResponse> {
    request.companyId = this.companyId;
    request.staffId = this.staffId;
    request.dateOfDelivery = request.dateOfDelivery ?
            formatAPIDate(new Date(request.dateOfDelivery)) :
            request.dateOfDelivery;
    request.datePaymentReceived = request.datePaymentReceived ?
            formatAPIDate(new Date(request.datePaymentReceived)) :
            request.datePaymentReceived;

    return this.api.post<GlobalResponse>(OpportunityRoutes.EditOpportunity.replace('opportunityId', request.opportunityId), request);
  }

  uploadOpportunityDocs(request: FileUploadRequest): Observable<any> {
    const formData = new FormData();
    formData.append('opportunityId', request.opportunityId);
    formData.append('staffId', this.staffId);
    request.files.forEach(file => {
      formData.append('fileCollection', file);
    });

    return this.api.postFile(OpportunityRoutes.UploadOpportunityDoc, formData);
  }

  getOpportunityDocs(opportunityId: string): Observable<FileUploadResponse[]> {
    return this.api.get<FileUploadResponse[]>(OpportunityRoutes.GetOpportunityDoc
      .replace('opportunityId', opportunityId));
  }
}
