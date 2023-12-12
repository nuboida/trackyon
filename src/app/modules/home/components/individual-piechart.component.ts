import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
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
        [data]="pieChartData"
        [type]="type"
        [options]="options"
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

  @Input() staffId!: string;
  @Input() staffName!: string;
  data: number[] = [];
  pieChartData!: ChartData<'pie'>
  chartLabels!: string[];
  chartColor!: any[];
  loading = true;
  chartDataLabels = [ChartDataLabels];

  options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      datalabels: {
        color: 'white',
        font: {
          size: 24
        },

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
        this.data = res.map((c) => c.number);
        this.chartLabels = res.map((c) => c.stageName);
        this.chartColor = res.map((c) => c.stageColor);
        this.pieChartData = {
          labels: this.chartLabels,
          datasets: [
            {
              data: this.data,
              backgroundColor: this.chartColor
            }
          ]
        }
      },
      error: () => {

      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
