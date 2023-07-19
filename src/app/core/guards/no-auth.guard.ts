import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Injectable()
export class NoAuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService) {}
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isAuthorised();
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      return this.isAuthorised();
  }

  isAuthorised(): boolean {
    if (!this.authService.isLoggedIn()) {
      return true;
    }
    this.authService.goToDashboard();
    return false;
  }

}
