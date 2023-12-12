import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'

@UntilDestroy()
@Component({
  selector: 'olla-amount-piechart',
  template: `
    <mat-card class="mh-400 shadow br-20">
      <mat-card-header class="header">
        <div>
          <h6>Net Profit By Deals Won <span style="font-size: 14px">({{staffName}}) - ({{ staffTarget | currency }})</span></h6>
        </div>
      </mat-card-header>
      <mat-card-content>
        <div class="row">
          <div class="col-xl-4">
            <mat-card>
              <mat-card-content>
                <div>
                  <div>
                    <div *ngIf="!loading" style="display: block">
                      <canvas baseChart height="330"
                      [data]="chartData"
                      [labels]="chartLabels"
                      [type]="type"
                      [options]="options"
                      [plugins]="plugins"
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
                  </div>
                  </div>
              </mat-card-content>
            </mat-card>
          </div>
          <div class="col-xl-4">
            <mat-card>
              <mat-card-content>
                <table>
                  <tr>
                    <th>Name</th>
                    <th style="text-align: right;">Margin</th>
                  </tr>
                  <tr *ngFor="let opportunity of allMargin">
                    <td style="font-size: 12px">{{opportunity.opportunityName}}</td>
                    <td style="text-align: right; font-size: 12px">{{opportunity.margin | currency:'USD':'symbol':'1.2-2'}}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr class="my-2 border-top border-bottom">
                    <td class="font-weight-bold">Total: </td>
                    <td class="font-weight-bold" style="text-align: right;">{{overallMargin | currency:'USD':'symbol':'1.2-2'}}</td>
                  </tr>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [

  ]
})
export class AmountsPiechartComponent implements OnInit {

  @Input() staffId!: string;
  @Input() staffName!: string;
  @Input() staffTarget!: number;
  @Input() margin!: {name: string; opportunityName: string; margin: number}[];
  @Input() quarter!: boolean;
  allMargin: {name: string; opportunityName: string; margin: number}[] = [];
  data!: number[]
  chartData!: ChartData<'pie'>;
  chartLabels!: string[];
  loading = true;
  overallMargin = 0;
  marginPercent = 0;
  chartDataLabels = [ChartDataLabels]

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
        this.allMargin.push(c);
      }
    })
    this.getChartData();
  }

  getChartData(): void {
    this.loading = true;
    this.overallMargin = this.allMargin.reduce((a, n) => a += n.margin, 0);
    if (this.quarter) {
      this.staffTarget = this.staffTarget / 4
    }
    this.marginPercent = this.overallMargin/this.staffTarget;
    const totalPercent = (this.staffTarget/this.staffTarget) * 1;
    if (this.staffTarget < this.overallMargin) {
      this.data = [0, totalPercent * 100];
    } else {
      this.data = [Number(((totalPercent - this.marginPercent)* 100).toFixed(2)), Number((this.marginPercent * 100).toFixed(2))];
    }
    this.chartLabels = ['Target Outstanding', 'Achieved'];
    this.loading = false;

    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        {
          data: this.data,
          backgroundColor: ['#dc3545', '#007bff']
        }
      ]
    }
  }
}
