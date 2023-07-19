import { Component, OnInit } from '@angular/core';
import { VerifyEmailRequest } from '@app/models/auth.model';
import { AuthService } from '@app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-send-verification',
  templateUrl: './send-verification.component.html',
  styleUrls: ['./send-verification.component.scss']
})
export class SendVerificationComponent {

  request: VerifyEmailRequest = {
    email: '',
  };
  constructor(private auth: AuthService, private toast: HotToastService) {}

  send(): void {
    this.auth.sendVerificationEmail(this.request).pipe(
      this.toast.observe(
        {
          loading: 'Send...',
          success: 'Email sent! Please check your email',
          error: 'Failed to send email.',
        }
      ),
      untilDestroyed(this)
    ).subscribe();
  }

}
