import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { AuthLayoutComponent, FooterComponent, MainLayoutComponent, NavbarComponent, SidebarComponent } from './layout';
import { CoreModule } from '@app/core.module';
import { SharedModule } from '@shared/shared.module';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { tokenGetter } from '@app/helpers/auth.helper';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@environments/environment';
import { HotToastModule } from '@ngneat/hot-toast';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    RouterLink,
    RouterLinkActive,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['api.trachyon.ollasystems.com'],
        disallowedRoutes: ['http://api.trachyon.ollasystems.com/trackingapi/auth/'],
        skipWhenExpired: true
      },
    }),
    EffectsModule.forRoot([]),
    HotToastModule.forRoot(),
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forRoot({ router: routerReducer}, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      name: 'Olla Tracker'
    }),
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
