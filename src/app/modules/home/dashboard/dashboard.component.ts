import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/operators';
import { DashboardStage, SalesStaff } from '../dashboard.model';
import { getClients, getMonthlySales, getOpportunities, getSales, getStages, getStats, State } from '../state';
import { DashboardPageActions } from '../state/actions';
import { AuthService } from '@app/services/auth.service';
import { Subject } from 'rxjs';
import { DashboardService } from '../dashboard.service';

@UntilDestroy()
@Component({
  selector: 'olla-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  clients$ = this.store.select(getClients);
  isAdmin = false;
  sales$ = this.store.select(getSales);
  opportunities$ = this.store.select(getOpportunities);
  stats$ = this.store.select(getStats);
  stages$ = this.store.select(getStages);
  stages!: DashboardStage[]
  individualStages: any[] = [];
  salesStaffs: SalesStaff[] = [];
  closedWonMargin: {name: string; margin: number}[] = [];
  paymentReceivedMargin: {name: string; margin: number}[] = [];
  overallTarget: number[] = [];
  monthlySales$ = this.store.select(getMonthlySales).pipe(
    map(s => [{ data: s, label: 'Sales By Month' }])
  );
  role = '';
  protected stop$ = new Subject<void>();

  totalStage!: number;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dashboardService: DashboardService
    ) {}

  ngOnInit(): void {
    this.authService.user$.pipe(takeUntil(this.stop$)).subscribe(
      user => {
        const roles = user?.roles;
        if (roles) {
          this.role = roles[0].replace(/([a-z])([A-Z])/, '$1 $2');
          this.isAdmin = roles.includes('Administrator');
        }
      }
    );
    this.store.dispatch(DashboardPageActions.loadStats());
    this.store.dispatch(DashboardPageActions.loadMonthlySales());
    this.store.dispatch(DashboardPageActions.loadStages());
    this.store.dispatch(DashboardPageActions.loadClients());
    this.store.dispatch(DashboardPageActions.loadOpportunities());
    this.store.dispatch(DashboardPageActions.loadSales());

    const data = this.route.snapshot.data;
    data.staffs.map((c: any) => {
      if (c.department === "Sales" && c.active && !c.firstName.includes('Donald') && !c.firstName.includes('Isaiah')) {
        let salesStaff = {
          name: `${c.firstName} ${c.lastName}`,
          staffId: c.staffId,
          target: c.target
        }
        this.salesStaffs.push(salesStaff);
        this.overallTarget.push(c.target);
      }
    });


    data.opportunities.map((c: any) => {
      if ((c.stage == "Payment Received" || c.stage.includes('Closed')) && c.fiscalPeriod.includes(new Date().getFullYear())) {
        let staffMargin = {
          name: c.staff,
          margin: c.margin,
        }
        this.closedWonMargin.push(staffMargin);
      }
      if ((c.stage === "Payment Received") && c.fiscalPeriod.includes(new Date().getFullYear())) {
        let staffMargin = {
          name: c.staff,
          margin: c.margin,
        }
        this.paymentReceivedMargin.push(staffMargin);
      }
    });

    this.dashboardService.getStages().pipe(untilDestroyed(this))
    .subscribe((res) => {
      this.stages = res;
      this.totalStage = this.stages.reduce((a, n) => a += n.number, 0);
    })
  }
}
