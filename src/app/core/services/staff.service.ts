import { Injectable } from '@angular/core';
import { StaffRoutes } from '@app/helpers/routes.helper';
import { GlobalResponse } from '@app/models/response.model';
import { ChangePictureRequest, RoleResponse, StaffCreateRequest, StaffResponse } from '@app/models/staff.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { formatAPIDate } from '@app/helpers/date.helper';

@Injectable()
export class StaffService {

  companyId!: string;

  constructor(private api: ApiService, private auth: AuthService) {
    this.auth.user$.subscribe(
      user => this.companyId = user?.companyId
    );
  }

  createStaff(request: StaffCreateRequest): Observable<GlobalResponse> {
    const queryRequest: StaffCreateRequest = {
      ...request,
      birthDate: formatAPIDate(new Date(request.birthDate)),
      dateOfResumption: formatAPIDate(new Date(request.dateOfResumption)),
    }
    return this.api.post<GlobalResponse>(StaffRoutes.CreateStaff.replace('companyId', this.companyId), queryRequest);
  }

  updateStaff(request: StaffCreateRequest): Observable<GlobalResponse> {
    const queryRequest: StaffCreateRequest = {
      ...request,
      birthDate: formatAPIDate(new Date(request.birthDate)),
      dateOfResumption: formatAPIDate(new Date(request.dateOfResumption)),
    }
    return this.api.post<GlobalResponse>(StaffRoutes.UpdateStaff, queryRequest)
  }

  getStaffs(): Observable<StaffResponse[]> {
    return this.api.get<StaffResponse[]>(StaffRoutes.CompanyStaffs.replace('companyId', this.companyId));
  }

  getStaff(staffId: string): Observable<StaffResponse> {
    return this.api.get<StaffResponse>(StaffRoutes.GetStaff.replace('staffId', staffId));
  }

  deactivateStaff(staffId: string): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(StaffRoutes.DeactivateStaff.replace('staffId', staffId));
  }

  activateStaff(staffId: string): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(StaffRoutes.ActivateStaff.replace('staffId', staffId));
  }

  getRoles(): Observable<RoleResponse[]> {
    return this.api.get<RoleResponse[]>(StaffRoutes.ListRole);
  }

  changePicture(request: ChangePictureRequest): Observable<GlobalResponse> {
    const formData = new FormData();
    formData.append('picture', request.image);
    return this.api.postFile(StaffRoutes.ChangePicture.replace('staffId', request.staffId), formData);
  }
}
