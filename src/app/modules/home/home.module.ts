import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducer } from './state/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './state/dashboard.effects';


@NgModule({
  declarations: [
    HomeRoutingModule.component
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgChartsModule,
    NgxSkeletonLoaderModule,
    StoreModule.forFeature(featureKey, reducer),
    EffectsModule.forFeature([DashboardEffects]),
    SharedModule
  ],
  exports: [],
  providers: [],
})
export class HomeModule { }
