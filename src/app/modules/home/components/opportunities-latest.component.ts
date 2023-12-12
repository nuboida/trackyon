import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { DashboardOpportunity } from '../dashboard.model';

@Component({
  selector: 'olla-opportunities-latest',
  template: `
    <mat-card class="mh-400 shadow br-20">
      <div class="header">
        <h6>Latest Opportunities</h6>
      </div>
      <div *ngFor="let item of opportunities">
        <h4 class="small font-weight-bold">{{item.name}}</h4>
        <div class="progress mb-4">
          <div class="progress-bar" role="progressbar" [ngStyle]="{'width': item.percentage+'%', 'background-color': item.color}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{item.percentage}}%</div>
        </div>
      </div>
      <div *ngIf="!opportunities">
        <div class="item" *ngFor="let item of count">
          <ngx-skeleton-loader [theme]="{'width': '40%', 'height': '15px'}" animation="pulse" ></ngx-skeleton-loader>
          <ngx-skeleton-loader [theme]="{'height': '15px'}" class="mb-3" animation="pulse" ></ngx-skeleton-loader>
        </div>
      </div>

    </mat-card>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunitiesLatestComponent {

  count = Array(5).fill('');
  @Input() opportunities!: DashboardOpportunity[] | null;
}
