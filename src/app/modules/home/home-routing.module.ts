import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatsCardsComponent } from './components/stats-cards.component';
import { StaffListResolver } from '@app/resolvers/settings.resolver';
import { AllOpportunityListResolver } from '@app/resolvers/dashboard.resolver';
import { SalesBarchartComponent } from './components/sales-barchart.component';
import { ClientsDoughnutchartComponent } from './components/clients-doughnutchart.component';
import { OpportunitiesStagesComponent } from './components/opportunity-stages.component';
import { OverallAmountsPiechartComponent } from './components/overallAmount-piechart.component';
import { OpportunitiesLatestComponent } from './components/opportunities-latest.component';
import { IndividualPiechartComponent } from './components/individual-piechart.component';
import { SalesTableComponent } from './components/sales-table.component';
import { OpportunitiesLostComponent } from './components/opportunitiesByClosed-lost.component';
import { TopOpportunitiesComponent } from './components/top-opportunities.component';
import { OpportunitiesWonComponent } from './components/opportunitiesByClosed-won.component';
import { PaymentReceivedComponent } from './components/paymentReceievd.component';
import { PercentPiechartComponent } from './components/percent-piechart.component';
import { AmountsPiechartComponent } from './components/amount-piechart.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, resolve: { staffs: StaffListResolver, opportunities: AllOpportunityListResolver  }}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {
  static component = [
    DashboardComponent,
    StatsCardsComponent,
    SalesBarchartComponent,
    ClientsDoughnutchartComponent,
    OpportunitiesStagesComponent,
    OverallAmountsPiechartComponent,
    OpportunitiesLatestComponent,
    IndividualPiechartComponent,
    SalesTableComponent,
    OpportunitiesLostComponent,
    TopOpportunitiesComponent,
    OpportunitiesWonComponent,
    PaymentReceivedComponent,
    PercentPiechartComponent,
    AmountsPiechartComponent
  ]
}
