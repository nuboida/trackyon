import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllOpportunityListResolver, StaffListResolver } from '@app/resolvers/dashboard.resolver';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, resolve: { staffs: StaffListResolver, opportunities: AllOpportunityListResolver  } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DashboardService]
})
export class HomeRoutingModule {
  static components = [DashboardComponent];
}
