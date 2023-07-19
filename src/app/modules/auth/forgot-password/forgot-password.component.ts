import { Component } from '@angular/core';
import { ForgotPasswordRequest } from '@app/models/auth.model';
import { AuthService } from '@app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  request: ForgotPasswordRequest = {
    email: ''
  };
  constructor(private auth: AuthService, private toast: HotToastService) {}

  reset(): void {
    this.auth.forgotPassword(this.request).pipe(
      this.toast.observe(
        {
          loading: 'Resetting...',
          success: 'Password reset! Please check your email',
          error: 'Could not reset your password.',
        }
      ),
      untilDestroyed(this)
    ).subscribe();
  }
}
