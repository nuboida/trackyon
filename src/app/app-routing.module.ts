import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/guards/auth.guard';
import { NoAuthGuard } from '@app/guards/no-auth.guard';
import { AuthLayoutComponent, MainLayoutComponent } from './layout';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@modules/auth/auth.module')
          .then(m => m.AuthModule)
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('@modules/home/home.module')
          .then(m => m.HomeModule)
      },
      {
        path: 'memo',
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('@modules/call-memo/call-memo.module')
          .then(m => m.CallMemoModule)
      },
      {
        path: 'opportunity',
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('@modules/opportunity/opportunity.module')
          .then(m => m.OpportunityModule)
      },
      {
        path: 'settings',
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('@modules/settings/settings.module')
          .then(m => m.SettingsModule)
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('@modules/profile/profile.module')
          .then(m => m.ProfileModule)
      },
      { path: '', redirectTo: '/home', pathMatch: 'full'  },
      { path: '**', redirectTo: '/home', pathMatch: 'full'  }
    ]
  },
  { path: '**', redirectTo: '/auth/verify-company', pathMatch: 'full'  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
