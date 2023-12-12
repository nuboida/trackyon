import { Injectable, inject } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn,
  ActivatedRoute
} from '@angular/router';
import { ProjectResponse, TaskResponse } from '@app/models/call-memo.model';
import { ClientContactResponse, ClientResponse } from '@app/models/client.model';
import { DepartmentResponse } from '@app/models/department.model';
import { OemResponse, OemContactResponse } from '@app/models/oem.model';
import { ClassificationResponse } from '@app/models/opportunity.model';
import { StaffResponse } from '@app/models/staff.model';
import { CallMemoService } from '@app/services/call-memo.service';
import { ClientService } from '@app/services/client.service';
import { DepartmentService } from '@app/services/department.service';
import { OemService } from '@app/services/oem.service';
import { OpportunityService } from '@app/services/opportunity.service';
import { StaffService } from '@app/services/staff.service';
import { Observable, of } from 'rxjs';

/* @Injectable({
  providedIn: 'root'
})
export class ClientListResolver implements Resolve<ClientResponse[]> {
  constructor(private clientService: ClientService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ClientResponse[]> {
    const clients = this.clientService.getClients();
    return clients;
  }
} */

export const ClientListResolver: ResolveFn<Observable<ClientResponse[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
    const clientService = inject(ClientService);
    const clients = clientService.getClients();
    return clients;
  }

/* @Injectable({
  providedIn: 'root'
})
export class ClientContactListResolver implements Resolve<ClientContactResponse[]> {
  constructor(private clientService: ClientService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ClientContactResponse[]> {
    const id = route.paramMap.get('id') as string;
    const contacts = this.clientService.getClientContacts(id);
    return contacts;
  }
} */

export const ClientContactListResolver: ResolveFn<Observable<ClientContactResponse[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const contacts = inject(ClientService).getClientContacts(route.paramMap.get('id')!);
  return contacts;
}


export const OemListResolver: ResolveFn<Observable<OemResponse[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const oemService = inject(OemService);
  const clients = oemService.getOems();
  return clients
}

/* @Injectable({
  providedIn: 'root'
})
export class OemContactListResolver implements Resolve<OemContactResponse[]> {
  constructor(private oemService: OemService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OemContactResponse[]> {
    const id = route.paramMap.get('id') as string;
    const contacts = this.oemService.getOemContacts(id);
    return contacts;
  }
} */

export const OemContactListResolver: ResolveFn<Observable<OemContactResponse[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const id = route.paramMap.get('id') as string;
  const oemService = inject(OemService);
  const contacts = oemService.getOemContacts(id);
  return contacts;
}

/* @Injectable({
  providedIn: 'root'
})
export class ClassificationListResolver implements Resolve<ClassificationResponse[]> {
  constructor(private opptService: OpportunityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ClassificationResponse[]> {
    const classifications = this.opptService.getClassifications();
    return classifications;
  }
} */

export const ClassificationListResolver: ResolveFn<Observable<ClassificationResponse[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const opptService = inject(OpportunityService);
  const classifications = opptService.getClassifications();
  return classifications;
}

export const ProjectListResolver: ResolveFn<Observable<ProjectResponse[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const memoService= inject(CallMemoService);
  const projects = memoService.getProjects();
  return projects;
}

/* @Injectable({
  providedIn: 'root'
})
export class TaskListResolver implements Resolve<TaskResponse[]> {
  constructor(private memoService: CallMemoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse[]> {
    const tasks = this.memoService.getTasks();
    return tasks;
  }
} */

export const TaskListResolver: ResolveFn<Observable<TaskResponse[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const memoService = inject(CallMemoService)
  const tasks = memoService.getTasks();
  return tasks;
}

export const DepartmentListResolver: ResolveFn<Observable<DepartmentResponse[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const departmentService = inject(DepartmentService);
  const departments = departmentService.getDepartments();
  return departments;
}


export const StaffListResolver: ResolveFn<Observable<StaffResponse[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const staffService = inject(StaffService);
  const staffs = staffService.getStaffs();
  return staffs;
}
