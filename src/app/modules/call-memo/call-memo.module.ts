import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallMemoRoutingModule } from './call-memo-routing.module';

import { CallMemoCreateComponent } from './call-memo-create/call-memo-create.component';
import { StoreModule, StoreRootModule } from '@ngrx/store';
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
import { StaffMemoEditComponent } from './components/staff-memo-edit/staff-memo-edit.component';
import { StaffAppraisalDialogComponent } from './components/staffAppraisalDialog/staffAppraisalDialog.component';
import { TaskAppraisalsComponent } from './tasks/taskAppraisals/taskAppraisals.component';
import { CreateAppraisalComponent } from './tasks/components/create-appraisal/create-appraisal.component';
import { DeptAppraisalComponent } from './dept-memo/deptAppraisal/deptAppraisal.component';
import { CreateDeptAppraisalComponent } from './dept-memo/createDeptAppraisal/createDeptAppraisal.component';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@app/core.module';



@NgModule({
  declarations: [
    CallMemoRoutingModule.components,
    CallMemoCreateComponent,
    CallMemoDetailComponent,
    DeptMemoEditComponent,
    AppraisalDialogComponent,
    StaffMemoEditComponent,
    StaffAppraisalDialogComponent,
    TaskAppraisalsComponent,
    CreateAppraisalComponent,
    DeptAppraisalComponent,
    CreateDeptAppraisalComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    StoreRootModule,
    CallMemoRoutingModule,
    FullCalendarModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([CallMemoEffects]),
    SharedModule
  ]
})
export class CallMemoModule { }
