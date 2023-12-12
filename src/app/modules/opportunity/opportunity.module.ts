import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpportunityRoutingModule } from './opportunity-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ActivityCreateComponent } from './components/activity-create/activity-create.component';
import { StageUpdateComponent } from './components/stage-update/stage-update.component';
import { MarginCalculatorComponent } from './components/margin-calculator/margin-calculator.component';
import { reducer, featureKey } from './state/opportunity.reducer';
import { OpportunityListEffects } from './state/opportunity-list.effects';
import { OpportunityItemEffects } from './state/opportunity-item.effects';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [OpportunityRoutingModule.components, ActivityCreateComponent, StageUpdateComponent, MarginCalculatorComponent],
  imports: [
    CommonModule,
    OpportunityRoutingModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([ OpportunityListEffects, OpportunityItemEffects ]),
    SharedModule
  ]
})
export class OpportunityModule { }
