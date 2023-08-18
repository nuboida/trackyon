import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { ChartsModule } from 'ng2-charts';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from '@shared/index';
import { SalesBarchartComponent } from './components/sales-barchart.component';
import { ClientsDoughnutchartComponent } from './components/clients-doughnutchart.component';
import { OpportunitiesPiechartComponent } from './components/opportunities-piechart.component';
import { OpportunitiesLatestComponent } from './components/opportunities-latest.component';
import { SalesTableComponent } from './components/sales-table.component';
import { StoreModule } from '@ngrx/store';
import { reducer, featureKey } from './state/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './state/dashboard.effects';
import { StatsCardsComponent } from './components/stats-cards.component';
import { IndividualPiechartComponent } from './components/individual-piechart.component';
import { AmountsPiechartComponent } from './components/amount-piechart.component';
import { OverallAmountsPiechartComponent } from './components/overallAmount-piechart.component';
import { PercentPiechartComponent } from './components/percent-piechart.component';
import { OpportunitiesStagesComponent } from './components/opportunity-stages.component';
import { TopOpportunitiesComponent } from './components/top-opportunities.component';
import { OpportunitiesLostComponent } from './components/opportunitiesByClosed-lost.component';
import { OpportunitiesWonComponent } from './components/opportunitiesByClosed-won.component';
import { PaymentReceivedComponent } from './components/paymentReceievd.component';


@NgModule({
  declarations: [
    HomeRoutingModule.components, SalesBarchartComponent,
    ClientsDoughnutchartComponent, OpportunitiesPiechartComponent,
    OpportunitiesLatestComponent, SalesTableComponent, StatsCardsComponent, IndividualPiechartComponent,
    AmountsPiechartComponent, OverallAmountsPiechartComponent, PercentPiechartComponent,
    OpportunitiesStagesComponent, TopOpportunitiesComponent, OpportunitiesLostComponent, OpportunitiesWonComponent,
    PaymentReceivedComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ChartsModule,
    NgxSkeletonLoaderModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([DashboardEffects]),
    SharedModule
  ]
})
export class HomeModule { }
