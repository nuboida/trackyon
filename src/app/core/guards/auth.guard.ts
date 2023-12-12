import { inject } from '@angular/core';
import {
    CanActivateFn, CanActivateChildFn, CanMatchFn
} from '@angular/router';
import { AuthService } from '@app/services/auth.service';


export function AuthGuard(): CanActivateFn | CanActivateChildFn | CanMatchFn {
  return () => {
    const oauthService: AuthService = inject(AuthService);

    if (oauthService.isLoggedIn()) {
      return true;
    }
    oauthService.logout();
    return false;
  }
}
