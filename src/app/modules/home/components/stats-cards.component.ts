import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { DashboardStat } from '../dashboard.model';

@Component({
  selector: 'olla-stats-cards',
  template: `
    <div class="row" *ngIf="stats; else loading">
      <div class="col-xl-3 col-md-6 mb-4">
        <mat-card class="stat-card stat-card--client">
          <mat-card-content>
            <div class="stat-card__info">
              <h6>clients</h6>
              <h5>{{stats.clients}}</h5>
            </div>
            <div class="stat-card__icon">
              <mat-icon aria-hidden="false" aria-label="Example home icon">person</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      <div class="col-xl-3 col-md-6 mb-4">
        <mat-card class="stat-card stat-card--memo">
          <mat-card-content>
            <div class="stat-card__info">
              <h6>contacts</h6>
              <h5>{{stats.contacts}}</h5>
            </div>
            <div class="stat-card__icon">
              <mat-icon aria-hidden="false" aria-label="Example home icon">settings_phone</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      <div class="col-xl-3 col-md-6 mb-4">
        <mat-card class="stat-card stat-card--appointment">
          <mat-card-content>
            <div class="stat-card__info">
              <h6>opportunities</h6>
              <h5>{{stats.opportunities}}</h5>
            </div>
            <div class="stat-card__icon">
              <mat-icon aria-hidden="false" aria-label="Example home icon">work</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      <div class="col-xl-3 col-md-6 mb-4">
        <mat-card class="stat-card stat-card--sale">
          <mat-card-content>
            <div class="stat-card__info">
              <h6>sales</h6>
              <h5>{{stats.sales |currency:'USD':'symbol':'1.0'}}</h5>
            </div>
            <div class="stat-card__icon">
              <mat-icon aria-hidden="false" aria-label="Example home icon">attach_money</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
    <ng-template #loading>
      <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
          <mat-card class="stat-card stat-card--client">
            <mat-card-content>
              <div class="stat-card__info">
                <h6 class="mb-0"><ngx-skeleton-loader animation="pulse" [theme]="{ width: '50px', height: '15px'}"></ngx-skeleton-loader></h6>
                <ngx-skeleton-loader animation="pulse" [theme]="{ width: '100px'}"></ngx-skeleton-loader>
              </div>
              <div class="stat-card__icon">
                <ngx-skeleton-loader animation="pulse" appearance="circle"></ngx-skeleton-loader>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="col-xl-3 col-md-6 mb-4">
          <mat-card class="stat-card stat-card--memo">
            <mat-card-content>
              <div class="stat-card__info">
                <h6 class="mb-0"><ngx-skeleton-loader animation="pulse" [theme]="{ width: '50px', height: '15px'}"></ngx-skeleton-loader></h6>
                <ngx-skeleton-loader animation="pulse" [theme]="{ width: '100px'}"></ngx-skeleton-loader>
              </div>
              <div class="stat-card__icon">
                <ngx-skeleton-loader animation="pulse" appearance="circle"></ngx-skeleton-loader>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="col-xl-3 col-md-6 mb-4">
          <mat-card class="stat-card stat-card--appointment">
            <mat-card-content>
              <div class="stat-card__info">
                <h6 class="mb-0"><ngx-skeleton-loader animation="pulse" [theme]="{ width: '50px', height: '15px'}"></ngx-skeleton-loader></h6>
                <ngx-skeleton-loader animation="pulse" [theme]="{ width: '100px'}"></ngx-skeleton-loader>
              </div>
              <div class="stat-card__icon">
                <ngx-skeleton-loader animation="pulse" appearance="circle"></ngx-skeleton-loader>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="col-xl-3 col-md-6 mb-4">
          <mat-card class="stat-card stat-card--sale">
            <mat-card-content>
              <div class="stat-card__info">
                <h6 class="mb-0"><ngx-skeleton-loader animation="pulse" [theme]="{ width: '50px', height: '15px'}"></ngx-skeleton-loader></h6>
                <ngx-skeleton-loader animation="pulse" [theme]="{ width: '100px'}"></ngx-skeleton-loader>
              </div>
              <div class="stat-card__icon">
                <ngx-skeleton-loader animation="pulse" appearance="circle"></ngx-skeleton-loader>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ['../dashboard/dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsCardsComponent {

  @Input() stats!: DashboardStat | null;
}
