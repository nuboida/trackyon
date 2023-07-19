import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartOptions, ChartType } from 'chart.js';
import { DashboardService } from '../dashboard.service';
import ChartDataLabels from 'chartjs-plugin-datalabels'

@UntilDestroy()
@Component({
  selector: 'olla-amount-piechart',
  template: `
    <mat-card class="mh-400 shadow br-20">
      <div class="header">
        <h6>Margins <span style="font-size: 14px">({{staffName}})</span></h6>
        <h6 style="font-size: 13px">Target - ({{ staffTarget | currency }})</h6>
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
    </mat-card>
  `,
  styles: [
  ]
})
export class AmountsPiechartComponent implements OnInit {

  @Input() staffId: string;
  @Input() staffName: string;
  @Input() staffTarget: number;
  @Input() margin: {name: string; margin: number}[];
  allMargin: number[] = [];
  chartData: number[];
  chartLabels!: string[];
  chartColor!: any[];
  loading = true;
  chartDataLabels = [ChartDataLabels]

  options: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom'
    },
    plugins: {
      datalabels: {
        color: 'white',
        font:{
          size: 24
        },
        formatter: function (value, context) {
          return `${Number((value/270000).toFixed(2))*100}%`
        }
      }
    }
  };

  type: ChartType = 'pie';
  legend = true;
  plugins: any[] = [];
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.margin.map((c) => {
      if (c.name === this.staffName) {
        this.allMargin.push(c.margin);
      }
    })
    this.getChartData();
  }

  getChartData(): void {
    this.loading = true;
    const overallMargin = this.allMargin.reduce((a, n) => a += n, 0);
    if (this.staffTarget < overallMargin) {
      this.chartData = [0, overallMargin]
    } else {
      this.chartData = [Number((this.staffTarget - overallMargin).toFixed(2)), overallMargin]
    }
    this.chartLabels = ['Outstanding Sales', 'Achieved'];
    this.chartColor = [{backgroundColor: ['#dc3545', '#007bff']}];
    this.loading = false;
  }
}
