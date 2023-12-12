import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment, CanActivateFn, CanActivateChildFn, CanMatchFn } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/* @Injectable()
export class AdminGuard implements CanActivate, CanLoad {

  constructor(private auth: AuthService, private toast: HotToastService) {}
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.isAuthorised();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.isAuthorised();
  }

  isAuthorised(): Observable<boolean> {

    return this.auth.user$.pipe(map(
      user => {
        if (user?.roles.includes('Administrator')) {
          return true;
        }

        this.toast.warning('You are not authorised to access this page');
        return false;
      }
    ));
  }

} */

export function AdminGuard(): CanActivateFn | CanActivateChildFn | CanMatchFn {
  return () => {
    const oauthService: AuthService = inject(AuthService);
    return oauthService.user$.pipe(map(
      user => {
        if (user.roles.includes('Administrator')) {
          return true;
        }
        inject(HotToastService).warning('You are not authorised to access this page');
        return false;
      }
    ))
  }
}
