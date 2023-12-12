import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';


@Component({
  selector: 'olla-sales-barchart',
  template: `
    <mat-card class="d-non d-md-block shadow of-auto br-20">
      <div class="header">
        <h6>Sales Overview</h6>
      </div>
      <div class="chart" style="display: block;">
        <canvas baseChart height="100"
          [data]="barChartData"
          [options]="barChartOptions"
          [plugins]="barChartPlugins"
          >
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
  @Input() data!: number[] | null;
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };

  barChartType: ChartType = 'bar';
  barChartPlugins: any[] = [];
  barChartColors = [{backgroundColor: Array(12).fill('#4e73df')}];
  public barChartData: ChartData<'bar'> = {
    labels: months,
    datasets: [
      {
        data: this.data || [],
        backgroundColor: Array(12).fill('#4e73df')
      }
    ]
  }
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
