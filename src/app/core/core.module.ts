import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HttpConfigInterceptor } from './interceptors/http-config.interceptor';
import { tokenGetter } from './helpers/auth.helper';
import { OemService } from './services/oem.service';
import { OpportunityService } from './services/opportunity.service';
import { ClientService } from './services/client.service';
import { StaffService } from './services/staff.service';
import { ExcelService } from './services/excel.service';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CallMemoService } from './services/call-memo.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['api.trachyon.ollasystems.com'],
        disallowedRoutes: ['http://api.trachyon.ollasystems.com/trackingapi/auth/'],
        skipWhenExpired: true
      },
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ApiService, AuthService, OemService, OpportunityService, ClientService, StaffService,
    ExcelService, AuthGuard, NoAuthGuard, AdminGuard, CallMemoService
  ]
})
export class CoreModule { }
