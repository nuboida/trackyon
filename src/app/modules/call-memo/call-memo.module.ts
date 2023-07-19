import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallMemoRoutingModule } from './call-memo-routing.module';
import { SharedModule } from '@shared/index';
import { CallMemoCreateComponent } from './call-memo-create/call-memo-create.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { featureKey, reducer } from './state/call-memo.reducer';
import { CallMemoEffects } from './state/call-memo.effects';
import { CallMemoDetailComponent } from './components/call-memo-detail/call-memo-detail.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { DeptMemoEditComponent } from './components/dept-memo-edit/dept-memo-edit.component';
import { AppraisalDialogComponent } from './components/appraisalDialog/appraisalDialog.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin
]);


@NgModule({
  declarations: [CallMemoRoutingModule.components, CallMemoCreateComponent, CallMemoDetailComponent, DeptMemoEditComponent, AppraisalDialogComponent],
  imports: [
    CommonModule,
    CallMemoRoutingModule,
    FullCalendarModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([CallMemoEffects]),
    SharedModule
  ]
})
export class CallMemoModule { }
