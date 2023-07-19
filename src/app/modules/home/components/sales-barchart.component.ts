import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'olla-sales-barchart',
  template: `
    <mat-card class="d-non d-md-block shadow of-auto br-20">
      <div class="header">
        <h6>Sales Overview</h6>
      </div>
      <div class="chart" style="display: block;">
        <canvas baseChart height="100"
          [datasets]="barChartData"
          [labels]="barChartLabels"
          [colors]="barChartColors"
          [options]="barChartOptions"
          [plugins]="barChartPlugins"
          [legend]="barChartLegend"
          [chartType]="barChartType">
        </canvas>
      </div>
    </mat-card>
  `,
  styles: [`
    @media (max-width: 767.98px) {
      .chart, .header {
        width: 800px;
      }
    }
  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesBarchartComponent {

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  @Input() barChartLabels: Label[] = months;
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins: any[] = [];
  barChartColors: Color[] = [{backgroundColor: Array(12).fill('#4e73df')}];
  @Input() barChartData: ChartDataSets[];
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
