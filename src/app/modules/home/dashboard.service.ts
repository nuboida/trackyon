import { Injectable } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { AuthService } from '@app/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardClient, DashboardMonthSale, DashboardOpportunity, DashboardSale, DashboardStage, DashboardStat } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  protected stages = 'dashboard/opportunities-stage/';
  protected clients = 'dashboard/clients/';
  protected opportunites = 'dashboard/latest-opportunities/';
  protected stats = 'dashboard/stats/';
  protected sales = 'dashboard/top-sales/';
  protected monthlySales = 'dashBoard/year-monthly-sales/';
  companyId!: string;
  staffId!: string;

  constructor(private api: ApiService, private auth: AuthService) {
    this.auth.user$.subscribe(user => {
      this.companyId = user?.companyId;
      this.staffId = user?.staffId;
    });
   }

  getStages(): Observable<DashboardStage[]> {
    return this.api.get<DashboardStage[]>(`${this.stages}${this.companyId}/${this.staffId}`);
  }

  getIndividualStages(staffId: string): Observable<DashboardStage[]> {
    return this.api.get<DashboardStage[]>(`${this.stages}${this.companyId}/${staffId}`);
  }

  getClients(): Observable<DashboardClient> {
    return this.api.get<DashboardClient>(this.clients + this.companyId);
  }

  getOpportunities(): Observable<DashboardOpportunity[]> {
    return this.api.get<DashboardOpportunity[]>(`${this.opportunites}${this.companyId}/${this.staffId}`);
  }

  getStats(): Observable<DashboardStat> {
    return this.api.get<DashboardStat>(`${this.stats}${this.companyId}/${this.staffId}`);
  }

  getSales(): Observable<DashboardSale[]> {
    return this.api.get<DashboardSale[]>(`${this.sales}${this.companyId}/${this.staffId}`);
  }

  getMonthlySales(): Observable<number[]> {
    return this.api.get<DashboardMonthSale[]>(`${this.monthlySales}${this.companyId}/${this.staffId}`)
      .pipe(map(arr => arr.map(a => a.totalAmount)));
  }
}
