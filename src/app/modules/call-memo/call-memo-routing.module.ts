import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '@app/guards/admin.guard';
import { CallMemoListComponent } from './call-memo-list/call-memo-list.component';
import { CallMemoComponent } from './call-memo.component';
import { DeptMemoComponent } from './dept-memo/dept-memo.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskAppraisalsComponent } from './tasks/taskAppraisals/taskAppraisals.component';
import { DeptAppraisalComponent } from "./dept-memo/deptAppraisal/deptAppraisal.component"
import { TaskStaffResolver } from '@app/resolvers/task-staff.resolver';
import { TaskDeptResolver } from '@app/resolvers/task-dept.resolver';
import { CallMemoCreateComponent } from './call-memo-create/call-memo-create.component';

const routes: Routes = [
  { path: 'personal', component: CallMemoComponent },
  { path: 'staff', component: CallMemoListComponent , canActivate: [ AdminGuard ] },
  { path: 'department', component: DeptMemoComponent, canActivate: [ AdminGuard ] },
  { path: 'department/:deptId/:id/:startDate/:endDate', component: DeptAppraisalComponent, resolve: {data: TaskDeptResolver}},
  { path: 'tasks', component: TasksComponent, canActivate: [ AdminGuard ]},
  { path: 'tasks/:staffId/:id/:startDate/:endDate', component: TaskAppraisalsComponent, resolve: {data: TaskStaffResolver}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallMemoRoutingModule {
  static components = [CallMemoComponent, CallMemoListComponent, DeptMemoComponent, TasksComponent, DeptAppraisalComponent,
  CallMemoCreateComponent];
}
