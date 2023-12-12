import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HttpConfigInterceptor } from './interceptors/http-config.interceptor';
import { OemService } from './services/oem.service';
import { OpportunityService } from './services/opportunity.service';
import { ClientService } from './services/client.service';
import { StaffService } from './services/staff.service';
import { ExcelService } from './services/excel.service';
import { CallMemoService } from './services/call-memo.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ApiService, AuthService, OemService, OpportunityService, ClientService, StaffService,CallMemoService,
    ExcelService,
  ]
})
export class CoreModule { }
