import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpportunityItemResolver } from '@app/resolvers/opportunity-item.resolver';
import { OpportunityListResolver } from '@app/resolvers/opportunity-list.resolver';
import { OpportunityCreateComponent } from './components/opportunity-create/opportunity-create.component';
import { OpportunityItemComponent } from './opportunity-item/opportunity-item.component';
import { OpportunityListComponent } from './opportunity-list/opportunity-list.component';

const routes: Routes = [
  { path: '', component: OpportunityListComponent, resolve: {data: OpportunityListResolver} },
  { path: ':id', component: OpportunityItemComponent, resolve: {data: OpportunityItemResolver} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpportunityRoutingModule {
  static components = [OpportunityListComponent, OpportunityItemComponent, OpportunityCreateComponent];
 }
