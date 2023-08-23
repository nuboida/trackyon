import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@UntilDestroy()
@Component({
  selector: 'olla-percent-piechart',
  template: `
    <mat-card class="mh-400 shadow br-20">
      <div class="header">
        <h6>Net Profit By Payment Received <span style="font-size: 14px">({{staffName}})</span></h6>
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
export class PercentPiechartComponent implements OnInit {

  @Input() staffId: string;
  @Input() staffName: string;
  @Input() staffTarget: number;
  @Input() margin: {name: string; margin: number}[];
  allMargin: number[] = [];
  chartData: number[];
  chartLabels!: string[];
  chartColor!: any[];
  loading = true;
  overallMargin = 0;
  marginPercent = 0;
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
        },
        formatter: function (value, context) {
          return `${value}%`;
        }
      }
    }
  };

  type: ChartType = 'pie';
  legend = true;
  plugins: any[] = [];
  constructor() {}

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
    this.overallMargin = this.allMargin.reduce((a, n) => a += n, 0);
    this.marginPercent = this.overallMargin/this.staffTarget;
    const totalPercent = (this.staffTarget/this.staffTarget) * 1;
    if (this.staffTarget < this.overallMargin) {
      this.chartData = [0, totalPercent * 100];
    } else {
      this.chartData = [Number(((totalPercent - this.marginPercent)* 100).toFixed(2)), Number((this.marginPercent * 100).toFixed(2))];
    }
    this.chartLabels = ['Target Outstanding', 'Achieved'];
    this.chartColor = [{backgroundColor: ['#dc3545', '#007bff']}];
    this.loading = false;
  }
}
