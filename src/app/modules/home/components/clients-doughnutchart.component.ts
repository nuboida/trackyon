import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'olla-clients-doughnutchart',
  template: `
    <mat-card class="mh-400 shadow br-20">
      <div class="header">
        <h6>Clients</h6>
      </div>
      <div *ngIf="data" style="display: block">
        <canvas baseChart height="310"
          [data]="data" [colors]="colors"
          [labels]="labels" [options]="options"
          [chartType]="type" [plugins]="chartDataLabels">
        </canvas>
      </div>
      <div *ngIf="!data" class="d-flex justify-content-center">
        <ngx-skeleton-loader appearance="circle" animation="pulse" [theme]="{'width': '260px', 'height': '260px'}"></ngx-skeleton-loader>
      </div>
      <div *ngIf="!data" class="d-flex  justify-content-between">
        <ngx-skeleton-loader animation="pulse" [theme]="{'width': '100px'}"></ngx-skeleton-loader>
        <ngx-skeleton-loader animation="pulse" [theme]="{'width': '100px'}"></ngx-skeleton-loader>
      </div>
    </mat-card>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsDoughnutchartComponent {

  @Input() data: number[];

  labels: Label[] = ['Actual Clients', 'Potential Clients'];
  type: ChartType = 'doughnut';
  colors: Color[] = [{ backgroundColor: ['#4e73df', '#1cc88a'] }];
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
          size: 24
        }
      }
    }
  };

}
