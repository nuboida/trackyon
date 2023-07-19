import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '@app/guards/admin.guard';
import { CallMemoListComponent } from './call-memo-list/call-memo-list.component';
import { CallMemoComponent } from './call-memo.component';
import { DeptMemoComponent } from './dept-memo/dept-memo.component';

const routes: Routes = [
  { path: 'personal', component: CallMemoComponent },
  { path: 'staff', component: CallMemoListComponent , canActivate: [ AdminGuard ] },
  { path: 'department', component: DeptMemoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallMemoRoutingModule {
  static components = [CallMemoComponent, CallMemoListComponent, DeptMemoComponent];
}
