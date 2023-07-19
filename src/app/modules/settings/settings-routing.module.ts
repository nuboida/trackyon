import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '@app/guards/admin.guard';
import {
  ClassificationListResolver, TaskListResolver,
  ClientContactListResolver, ClientListResolver,
  OemContactListResolver, OemListResolver,
  ProjectListResolver, StaffListResolver, DepartmentListResolver,
} from '@app/resolvers/settings.resolver';
import { ClassificationComponent } from './classification/classification.component';
import { ClientContactComponent } from './client/client-contact/client-contact.component';
import { ClientComponent } from './client/client.component';
import { DepartmentComponent } from './department/department.component';
import { OemContactComponent } from './oem/oem-contact/oem-contact.component';
import { OemComponent } from './oem/oem.component';
import { ProjectComponent } from './project/project.component';
import { StaffComponent } from './staff/staff.component';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  { path: 'client', component: ClientComponent, resolve: {data: ClientListResolver} },
  { path: 'client/:id', component: ClientContactComponent, resolve: {data: ClientContactListResolver} },
  { path: 'oem', component: OemComponent, resolve: {data: OemListResolver} },
  { path: 'oem/:id', component: OemContactComponent, resolve: {data: OemContactListResolver} },
  { path: 'staff', component: StaffComponent, canActivate: [AdminGuard], resolve: {data: StaffListResolver} },
  { path: 'department', component: DepartmentComponent, canActivate: [AdminGuard], resolve: {data: DepartmentListResolver} },
  { path: 'classification', component: ClassificationComponent, canActivate: [AdminGuard], resolve: {data: ClassificationListResolver}},
  { path: 'project', component: ProjectComponent, canActivate: [AdminGuard], resolve: {data: ProjectListResolver} },
  { path: 'task', component: TaskComponent, canActivate: [AdminGuard], resolve: {data: TaskListResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {
  static components = [
    ClientComponent, ClientContactComponent,
    OemComponent, OemContactComponent,
    StaffComponent, ClassificationComponent,
    ProjectComponent, TaskComponent, DepartmentComponent
  ];
 }
