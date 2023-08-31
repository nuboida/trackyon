import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartOptions, ChartType } from 'chart.js';
import { DashboardService } from '../dashboard.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@UntilDestroy()
@Component({
  selector: 'olla-overallamount-piechart',
  template: `
    <mat-card class="mh-400 shadow br-20">
      <div class="header">
        <h6>Margins <span style="font-size: 14px">(Overall)</span> - Target {{ overallTarget | currency: 'USD':'symbol':'1.2-2' }}</h6>
      </div>
      <div *ngIf="!loading" style="display: block">
        <canvas baseChart height="330"
        [data]="chartData"
        [labels]="chartLabels"
        [chartType]="type"
        [options]="options"
        [plugins]="plugins"
        [colors]="chartColor"
        [legend]="legend"
        [plugins]="chartDataLabels"
        >
      </canvas>
      </div>
      <div *ngIf="loading" class="d-flex justify-content-center">
        <ngx-skeleton-loader appearance="circle" animation="pulse" [theme]="{'width': '260px', 'height': '260px'}"></ngx-skeleton-loader>
      </div>
      <div *ngIf="loading" class="d-flex  justify-content-between">
        <ngx-skeleton-loader animation="pulse" [theme]="{'width': '100px'}"></ngx-skeleton-loader>
        <ngx-skeleton-loader animation="pulse" [theme]="{'width': '100px'}"></ngx-skeleton-loader>
      </div>
      <div class="mt-400">
        <h6>Current Margin: {{ overallMargin | currency: 'USD':'symbol':'1.2-2' }}</h6>
      </div>
    </mat-card>
  `,
  styles: [
  ]
})
export class OverallAmountsPiechartComponent implements OnInit {

  @Input() margin: {name: string; margin: number}[];
  @Input() target: number[];
  overallTarget = 0;
  overallMargin = 0;
  chartData: number[];
  chartLabels!: string[];
  chartColor!: any[];
  loading = true;
  chartDataLabels = [ChartDataLabels];
  marginPercent = 0;

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
        },
        formatter: function (value, context) {
          return `${value}%`
        }
      }
    }
  };

  type: ChartType = 'pie';
  legend = true;
  plugins: any[] = [];
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getChartData();
  }

  getChartData(): void {
    this.loading = true;
    this.overallMargin = this.margin.reduce((a, n) => a += n.margin, 0);
    this.overallTarget = this.target.reduce((a, n) => a+=n, 0);
    this.marginPercent = this.overallMargin/this.overallTarget;
    const totalPercent = (this.overallTarget/this.overallTarget) * 1;

    if (this.overallTarget < this.overallMargin) {
      this.chartData = [0, totalPercent * 100]
    } else {
      this.chartData = [Number(((totalPercent - this.marginPercent) * 100).toFixed(2)), Number((this.marginPercent * 100).toFixed(2))];
    }
    this.chartLabels = ['Outstanding Sales', 'Achieved'];
    this.chartColor = [{backgroundColor: ['#dc3545', '#007bff']}];
    this.loading = false;
  }
}
