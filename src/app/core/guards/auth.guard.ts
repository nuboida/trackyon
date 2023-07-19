import { Injectable } from '@angular/core';
import {
   CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,
   UrlTree, CanLoad, Route, UrlSegment
} from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService) {}
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree  {
    return this.isAuthorised();
  }
  canActivateChild(): boolean | UrlTree {
    return this.isAuthorised();
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      return this.isAuthorised();
  }

  isAuthorised(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      return true;
    }

    this.authService.logout();
    return false;
  }

}
