import { Injectable } from '@angular/core';
import { OemRoutes } from '@app/helpers/routes.helper';
import { OemContactCreateRequest, OemCreateRequest, OemResponse, OemContactResponse } from '@app/models/oem.model';
import { GlobalResponse } from '@app/models/response.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable()
export class OemService {

  companyId!: string;

  constructor(private api: ApiService, private auth: AuthService) {
    this.auth.user$.subscribe(
      user => this.companyId = user?.companyId
    );
  }

  createOem(request: OemCreateRequest): Observable<GlobalResponse> {
    request.companyId = this.companyId;
    return this.api.post<GlobalResponse>(OemRoutes.CreateOem, request);
  }

  createOemContact(request: OemContactCreateRequest): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(OemRoutes.CreateOemContact, request);
  }

  getOems(): Observable<OemResponse[]> {
    return this.api.get<OemResponse[]>(OemRoutes.CompanyOems.replace('companyId', this.companyId));
  }

  getOem(oemId: string): Observable<OemResponse> {
    return this.api.get<OemResponse>(OemRoutes.GetOem.replace('oemId', oemId));
  }

  getOemContacts(oemId: string): Observable<OemContactResponse[]> {
    return this.api.get<OemContactResponse[]>(OemRoutes.ListOemContacts.replace('oemId', oemId));
  }
}
