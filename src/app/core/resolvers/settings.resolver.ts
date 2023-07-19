import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
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

@Injectable({
  providedIn: 'root'
})
export class ClientListResolver implements Resolve<ClientResponse[]> {
  constructor(private clientService: ClientService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ClientResponse[]> {
    const clients = this.clientService.getClients();
    return clients;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ClientContactListResolver implements Resolve<ClientContactResponse[]> {
  constructor(private clientService: ClientService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ClientContactResponse[]> {
    const id = route.paramMap.get('id') as string;
    const contacts = this.clientService.getClientContacts(id);
    return contacts;
  }
}


@Injectable({
  providedIn: 'root'
})
export class OemListResolver implements Resolve<OemResponse[]> {
  constructor(private oemService: OemService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OemResponse[]> {
    const clients = this.oemService.getOems();
    return clients;
  }
}

@Injectable({
  providedIn: 'root'
})
export class OemContactListResolver implements Resolve<OemContactResponse[]> {
  constructor(private oemService: OemService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OemContactResponse[]> {
    const id = route.paramMap.get('id') as string;
    const contacts = this.oemService.getOemContacts(id);
    return contacts;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ClassificationListResolver implements Resolve<ClassificationResponse[]> {
  constructor(private opptService: OpportunityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ClassificationResponse[]> {
    const classifications = this.opptService.getClassifications();
    return classifications;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProjectListResolver implements Resolve<ProjectResponse[]> {
  constructor(private memoService: CallMemoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProjectResponse[]> {
    const projects = this.memoService.getProjects();
    return projects;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TaskListResolver implements Resolve<TaskResponse[]> {
  constructor(private memoService: CallMemoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskResponse[]> {
    const tasks = this.memoService.getTasks();
    return tasks;
  }
}
@Injectable({
  providedIn: 'root'
})
export class DepartmentListResolver implements Resolve<DepartmentResponse[]> {
  constructor(private departmentService: DepartmentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DepartmentResponse[]> {
    const departments = this.departmentService.getDepartments();
    return departments;
  }
}


@Injectable({
  providedIn: 'root'
})
export class StaffListResolver implements Resolve<StaffResponse[]> {
  constructor(private staffService: StaffService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<StaffResponse[]> {
    const staffs = this.staffService.getStaffs();
    return staffs;
  }
}
