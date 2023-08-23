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
  quarter = true;
  quarterReceived = true;
  stages!: DashboardStage[]
  individualStages: any[] = [];
  salesStaffs: SalesStaff[] = [];
  closedWonMargin: {name: string; margin: number}[] = [];
  closedWonQ1Margin: {name: string; margin: number}[] = [];
  closedWonQ2Margin: {name: string; margin: number}[] = [];
  closedWonQ3Margin: {name: string; margin: number}[] = [];
  closedWonQ4Margin: {name: string; margin: number}[] = [];
  paymentReceivedMargin: {name: string; margin: number}[] = [];
  paymentReceivedQ1Margin: {name: string; margin: number}[] = [];
  paymentReceivedQ2Margin: {name: string; margin: number}[] = [];
  paymentReceivedQ3Margin: {name: string; margin: number}[] = [];
  paymentReceivedQ4Margin: {name: string; margin: number}[] = [];
  overallTarget: number[] = [];
  monthlySales$ = this.store.select(getMonthlySales).pipe(
    map(s => [{ data: s, label: 'Sales By Month' }])
  );
  role = '';
  protected stop$ = new Subject<void>();
  data = this.route.snapshot.data;

  totalStage!: number;
  quarterOptions = sessions;
  selectedQuarter: FormControl = new FormControl(0);
  selectReceivedQuarter: FormControl = new FormControl(0);

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


    this.data.staffs.map((c: any) => {
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

    this.getIndividualDealsWon();
    this.getIndividualPaymentReceived();



    this.dashboardService.getStages().pipe(untilDestroyed(this))
    .subscribe((res) => {
      this.stages = res;
      this.totalStage = this.stages.reduce((a, n) => a += n.number, 0);
    })
  }

  getIndividualDealsWon(): void {
    switch (this.selectedQuarter.value) {
      case 0:
        this.closedWonMargin = [];
        this.data.opportunities.map((c: any) => {
          if ((c.stage == "Payment Received" || c.stage.includes('Closed')) && c.fiscalPeriod.includes(new Date().getFullYear())) {
            let staffMargin = {
              name: c.staff,
              margin: c.margin,
            }
            this.closedWonMargin.push(staffMargin);
          }
        });
        break;

        case 1:
          this.closedWonQ1Margin = [];
          this.data.opportunities.map((c: any) => {
            if ((c.stage == "Payment Received" || c.stage.includes('Closed')) && (c.fiscalPeriod.includes(new Date().getFullYear()) && c.fiscalPeriod.includes('Q1'))) {
              let staffMargin = {
                name: c.staff,
                margin: c.margin,
              }

            this.closedWonQ1Margin.push(staffMargin);
            }
          });
          break;

        case 2:
          this.closedWonQ2Margin = [];
          this.data.opportunities.map((c: any) => {
            if ((c.stage == "Payment Received" || c.stage.includes('Closed')) && (c.fiscalPeriod.includes(new Date().getFullYear()) && c.fiscalPeriod.includes('Q2'))) {
              let staffMargin = {
                name: c.staff,
                margin: c.margin,
              }

            this.closedWonQ2Margin.push(staffMargin);
            }
          });
          break;
        case 3:
          this.closedWonQ3Margin = [];
          this.data.opportunities.map((c: any) => {
            if ((c.stage == "Payment Received" || c.stage.includes('Closed')) && (c.fiscalPeriod.includes(new Date().getFullYear()) && c.fiscalPeriod.includes('Q3'))) {
              let staffMargin = {
                name: c.staff,
                margin: c.margin,
              }

            this.closedWonQ3Margin.push(staffMargin);
            }
          });
          break;
        case 4:
          this.closedWonQ4Margin = [];
          this.data.opportunities.map((c: any) => {
            if ((c.stage == "Payment Received" || c.stage.includes('Closed')) && (c.fiscalPeriod.includes(new Date().getFullYear()) && c.fiscalPeriod.includes('Q4'))) {
              let staffMargin = {
                name: c.staff,
                margin: c.margin,
              }

            this.closedWonQ4Margin.push(staffMargin);
            }
          });
          break;
      default:
        break;
    }

  }

  getIndividualPaymentReceived(): void {
    switch (this.selectReceivedQuarter.value) {
      case 0:
        this.paymentReceivedMargin = [];
        this.data.opportunities.map((c: any) => {
          if ((c.stage === "Payment Received") && c.fiscalPeriod.includes(new Date().getFullYear())) {
            let staffMargin = {
              name: c.staff,
              margin: c.margin,
            }
            this.paymentReceivedMargin.push(staffMargin);
          }
        });
        break;

        case 1:
          this.paymentReceivedQ1Margin = [];
          this.data.opportunities.map((c: any) => {
            if ((c.stage == "Payment Received") && (c.fiscalPeriod.includes(new Date().getFullYear()) && c.fiscalPeriod.includes('Q1'))) {
              let staffMargin = {
                name: c.staff,
                margin: c.margin,
              }

            this.paymentReceivedQ1Margin.push(staffMargin);
            }
          });
          break;
        case 2:
          this.paymentReceivedQ2Margin = [];
          this.data.opportunities.map((c: any) => {
            if ((c.stage == "Payment Received") && (c.fiscalPeriod.includes(new Date().getFullYear()) && c.fiscalPeriod.includes('Q2'))) {
              let staffMargin = {
                name: c.staff,
                margin: c.margin,
              }

            this.paymentReceivedQ2Margin.push(staffMargin);
            }
          });
          break;
        case 3:
          this.paymentReceivedQ3Margin = [];
          this.data.opportunities.map((c: any) => {
            if ((c.stage == "Payment Received") && (c.fiscalPeriod.includes(new Date().getFullYear()) && c.fiscalPeriod.includes('Q3'))) {
              let staffMargin = {
                name: c.staff,
                margin: c.margin,
              }

            this.paymentReceivedQ3Margin.push(staffMargin);
            }
          });
          break;
        case 4:
          this.paymentReceivedQ4Margin = [];
          this.data.opportunities.map((c: any) => {
            if ((c.stage == "Payment Received") && (c.fiscalPeriod.includes(new Date().getFullYear()) && c.fiscalPeriod.includes('Q4'))) {
              let staffMargin = {
                name: c.staff,
                margin: c.margin,
              }

            this.paymentReceivedQ4Margin.push(staffMargin);
            }
          });
          break;
      default:
        break;
    }
  }
}

interface Option {
  name: string;
  value: number;
}

const sessions: Option[] = [
  { name: 'Annual', value: 0 },
  { name: 'Q1', value: 1 },
  { name: 'Q2', value: 2 },
  { name: 'Q3', value: 3 },
  { name: 'Q4', value: 4 },
]
