import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { DashboardStageVM } from '../dashboard.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'olla-opportunities-piechart',
  template: `
    <mat-card class="mh-400 shadow br-20">
      <mat-card-header>
        <div class="header">
          <h6>Opportunities By Stage <span style="font-size: 14px">(Overall)</span></h6>
        </div>
      </mat-card-header>
      <mat-card-content>

        <div *ngIf="stages" style="display: block">
          <canvas baseChart height="330"
          [data]="stages.data"
          [labels]="stages.labels"
          [chartType]="type"
          [options]="options"
          [plugins]="plugins"
          [colors]="stages.colors"
          [legend]="legend"
          [plugins]="chartDataLabels"
          >
        </canvas>
        </div>
        <div *ngIf="!stages" class="d-flex justify-content-center">
          <ngx-skeleton-loader appearance="circle" animation="pulse" [theme]="{'width': '260px', 'height': '260px'}"></ngx-skeleton-loader>
        </div>
        <div *ngIf="!stages" class="d-flex  justify-content-between">
          <ngx-skeleton-loader animation="pulse" [theme]="{'width': '100px'}"></ngx-skeleton-loader>
          <ngx-skeleton-loader animation="pulse" [theme]="{'width': '100px'}"></ngx-skeleton-loader>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunitiesPiechartComponent {

  @Input() stages: DashboardStageVM;

  chartDataLabels = [ChartDataLabels]
  options: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom'
    },
    plugins: {
      datalabels: {
        color: 'white',
        font: {
          size:24
        }
      }
    }
  };

  type: ChartType = 'pie';
  legend = true;
  plugins: any[] = [];
}
