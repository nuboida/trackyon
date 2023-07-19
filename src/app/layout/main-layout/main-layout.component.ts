import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeAnimation, sliderAnimation } from '@shared/animations/animation';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'olla-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  animations: [fadeAnimation, sliderAnimation]
})
export class MainLayoutComponent implements OnDestroy {

  side: MatDrawerMode = 'side';
  sidenav = true;
  protected stop$ = new Subject<void>();

  constructor(brkptObs: BreakpointObserver) {
    brkptObs.observe([Breakpoints.Large, Breakpoints.XLarge]).pipe(takeUntil(this.stop$))
    .subscribe(
      result => {
        if (result.matches) {
          this.side = 'side';
          this.sidenav = true;
        } else {
          this.side = 'over';
          this.sidenav = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }

  toggleSidenav(): void {
    this.sidenav = !this.sidenav;
  }

  prepareRoute(outlet: RouterOutlet): any {
    const animation = 'animation';
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData[animation];
  }

}
