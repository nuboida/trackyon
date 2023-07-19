import { Injectable } from '@angular/core';
import { DepartmentRoutes } from '@app/helpers/routes.helper';
import { DepartmentRequest, DepartmentResponse } from '@app/models/department.model';
import { GlobalEdit, GlobalResponse } from '@app/models/response.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  companyId!: string;
  staffId!: string;

constructor(private api: ApiService, private auth: AuthService) {
  this.auth.user$.subscribe(
    user => {
      this.companyId = user?.companyId;
      this.staffId = user?.staffId;
    }
  )
}

getDepartments(): Observable<DepartmentResponse[]> {
  return this.api.get<DepartmentResponse[]>(DepartmentRoutes.ListDepartment.replace('companyId', this.companyId));
}

createDepartment(departmentName: string): Observable<GlobalResponse> {
  const request: DepartmentRequest = {
    departmentName,
    companyId: this.companyId
  }
  return this.api.post<GlobalResponse>(DepartmentRoutes.CreateDepartment, request);
}

editDepartment(request: GlobalEdit): Observable<GlobalResponse> {
  return this.api.post<GlobalResponse>(DepartmentRoutes.EditDepartment, request)
}

}
