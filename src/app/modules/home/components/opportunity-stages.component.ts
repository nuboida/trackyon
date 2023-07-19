import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { DashboardOpportunity, DashboardStage } from '../dashboard.model';

@Component({
  selector: 'olla-opportunities-stages',
  template: `
    <mat-card class="mh-400 shadow br-20">
      <div class="header">
        <h6>Opportunities By Stages</h6>
      </div>
      <div *ngFor="let stage of stages">
        <h4 class="small font-weight-bold">{{stage.stageName}}</h4>
        <div class="d-flex">
          <div class="progress mb-4 flex-grow-1 w-100">
            <div
            class="progress-bar"
            role="progressbar"
            [ngStyle]="{'width': ((stage.number/totalStages)*100).toFixed(1)+'%', 'background-color': stage.stageName === 'Closed Won/Loss' ? '#007bff' : stage.stageName === 'Qualification' ? '#dc3545' : stage.stageColor}"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
            >
              {{((stage.number/totalStages)*100) | number: '1.0-0'}}%
            </div>
          </div>
          <h6 class="flex-shrink-1">
            ({{stage.number}})
          </h6>
        </div>
        </div>
      <div *ngIf="!stages">
        <div class="item" *ngFor="let item of count">
        <ngx-skeleton-loader [theme]="{'width': '40%', 'height': '15px'}" animation="pulse" ></ngx-skeleton-loader>
          <ngx-skeleton-loader [theme]="{'height': '15px'}" class="mb-3" animation="pulse" ></ngx-skeleton-loader>
        </div>
      </div>
    </mat-card>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunitiesStagesComponent {

  count = Array(5).fill('');
  @Input() stages: DashboardStage[];
  @Input() totalStages: number;
}
