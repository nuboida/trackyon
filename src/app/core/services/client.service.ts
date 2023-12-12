import { Injectable } from '@angular/core';
import { ClientRoutes } from '@app/helpers/routes.helper';
import {
  ClientResponse, ClientContactResponse,
  ClientContactCreateRequest, ClientCreateRequest
} from '@app/models/client.model';
import { GlobalResponse } from '@app/models/response.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class ClientService {

  companyId!: string;

  constructor(private api: ApiService, private auth: AuthService, private jwt: JwtHelperService) {
    this.auth.user$.subscribe(
      user => this.companyId = user?.companyId
    );
  }

  createClient(request: ClientCreateRequest): Observable<GlobalResponse> {
    request.companyId = this.companyId;
    return this.api.post<GlobalResponse>(ClientRoutes.CreateClient, request);
  }

  createClientContact(request: ClientContactCreateRequest): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(ClientRoutes.CreateClientContact, request);
  }

  getClients(): Observable<ClientResponse[]> {
    return this.api.get<ClientResponse[]>(ClientRoutes.CompanyClients.replace('companyId', this.companyId));
  }

  getClient(clientId: string): Observable<ClientResponse> {
    return this.api.get<ClientResponse>(ClientRoutes.GetClient.replace('clientId', clientId));
  }

  getClientContacts(clientId: string): Observable<ClientContactResponse[]> {
    return this.api.get<ClientContactResponse[]>(ClientRoutes.ListClientContacts.replace('clientId', clientId));
  }
}
