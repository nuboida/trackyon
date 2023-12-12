import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { OemCreateComponent } from './oem/oem-create/oem-create.component';
import { OemContactCreateComponent } from './oem/oem-contact-create/oem-contact-create.component';
import { StaffCreateComponent } from './staff/staff-create/staff-create.component';
import { ClassificationCreateComponent } from './classification/classification-create/classification-create.component';
import { TaskCreateComponent } from './task/task-create/task-create.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { DepartmentCreateComponent } from './department/department-create/department-create.component';
import { StaffDetailsComponent } from './staff/staff-details/staff-details.component';
import { TerminateDateComponent } from './staff/terminateDate/terminateDate.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    SettingsRoutingModule.components, OemCreateComponent,
    OemContactCreateComponent,
    StaffCreateComponent,
    ClassificationCreateComponent,
    TaskCreateComponent,
    ProjectCreateComponent,
    DepartmentCreateComponent,
    StaffDetailsComponent,
    TerminateDateComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
  ]
})
export class SettingsModule { }
