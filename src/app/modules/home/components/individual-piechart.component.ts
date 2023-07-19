import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartOptions, ChartType } from 'chart.js';
import { DashboardService } from '../dashboard.service';
import ChartDataLabels from 'chartjs-plugin-datalabels'

@UntilDestroy()
@Component({
  selector: 'olla-individual-piechart',
  template: `
    <mat-card class="mh-400 shadow br-20">
      <div class="header">
        <h6>Opportunities By Stage <span style="font-size: 14px">({{staffName}})</span></h6>
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
export class IndividualPiechartComponent implements OnInit {

  @Input() staffId: string;
  @Input() staffName: string;
  chartData: number[];
  chartLabels!: string[];
  chartColor!: any[];
  loading = true;
  chartDataLabels = [ChartDataLabels];

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
          return `${value}`
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
    this.dashboardService.getIndividualStages(this.staffId).pipe(untilDestroyed(this))
    .subscribe({
      next: (res) => {
        this.chartData = res.map((c) => c.number);
        this.chartLabels = res.map((c) => c.stageName);
        this.chartColor = [{ backgroundColor: res.map((c) => c.stageColor) }]
      },
      error: () => {

      },
      complete: () => {
        this.loading = false;
      }
    })
  }
}
