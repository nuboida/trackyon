import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { DashboardSale } from '../dashboard.model';
import { ActivatedRoute } from '@angular/router';
import { OpportunityResponse } from '@app/models/opportunity.model';

@Component({
  selector: 'olla-sales-table',
  template: `
    <mat-card class="shadow br-20">
      <div class="header">
        <h6>Top Sales</h6>
      </div>
      <mat-tab-group animationDuration="0ms" class="m-3">
        <mat-tab label="Top Opportunities">
          <div class="my-3">
            <olla-top-opportunities-table [opportunities]="topOpportunities"></olla-top-opportunities-table>
          </div>
        </mat-tab>
        <mat-tab label="Closed Opportunities - Won">
          <div class="my-3">
            <olla-opportunities-won-table [opportunities]="closedWonOpportunities"></olla-opportunities-won-table>
          </div>
        </mat-tab>
        <mat-tab label="Closed Opportunities - Lost">
          <div class="my-3">
            <olla-opportunities-lost-table [opportunities]="closedLostOpportunities"></olla-opportunities-lost-table>
          </div>
        </mat-tab>
        <mat-tab label="Payment Received">
          <div class="my-3">
            <olla-payment-received-table [opportunities]="paymentReceived"></olla-payment-received-table>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-card>
  `,
  styles: [`
  table {
    color: #5a5c69
  }
  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesTableComponent implements OnInit {

  displayedColumns: string[] = ['position', 'client', 'product', 'price', 'date'];
  @Input() sales: DashboardSale[] = [];
  topOpportunities: OpportunityResponse[] = [];
  closedWonOpportunities: OpportunityResponse[] = [];
  closedLostOpportunities: OpportunityResponse[] = [];
  paymentReceived: OpportunityResponse[] = []

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    const sortDataByValue = data.opportunities.sort((a: any, b: any) => {
      return b.sellingPrice < a.sellingPrice ? -1 : 1;
    });
    const currentYear = (new Date().getFullYear().toString());
    const currentFiscalPeriod = sortDataByValue.filter((c: OpportunityResponse) => c.fiscalPeriod.includes(currentYear));
    const topOpportunitiesData = currentFiscalPeriod.filter((c: OpportunityResponse) => c.stage !== "Closed Won/Loss");
    const closedDataByValue = currentFiscalPeriod.filter((c: OpportunityResponse) => c.stage === "Closed Won/Loss");
    this.paymentReceived = currentFiscalPeriod.filter((c: OpportunityResponse) => c.stage === 'Payment Received');
    const closedWon = closedDataByValue.filter((c: OpportunityResponse) => c.sellingPrice > 0);
    const closedLost = closedDataByValue.filter((c: OpportunityResponse) => c.amountPaid > 0);
    this.topOpportunities = topOpportunitiesData.slice(0, 5);
    this.closedWonOpportunities = closedWon.slice(0, 5);
    this.closedLostOpportunities = closedLost
  }
}
