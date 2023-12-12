import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
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
          [data]="doughnutChartData"
          [options]="options"
          [type]="doughnutChartType"
          [plugins]="chartDataLabels"
          >
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
export class ClientsDoughnutchartComponent implements OnChanges {

  @Input() data!: number[] | null;
  public options: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        color: 'white',
        font: {
          size: 24
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  }
  public doughnutChartType: ChartType = 'doughnut';
  public label: string[] = [
    'Actual Clients',
    'Potential Clients'
  ];
  public doughnutChartData!: ChartData<'doughnut'>;
  public chartDataLabels = [ChartDataLabels]

  ngOnChanges(changes: SimpleChanges): void {
    this.doughnutChartData = {
      labels: this.label,
      datasets: [
        {
          data: this.data || [],
          backgroundColor: ['#4e73df', '#1cc88a'],
        }
      ]
    }
  }
}
