import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerifyEmailRequest } from '@app/models/auth.model';
import { AuthService } from '@app/services/auth.service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  loading = true;
  success = false;
  errorMessage: string;
  request: VerifyEmailRequest = {
    email: '',
    token: ''
  };
  constructor(private route: ActivatedRoute, private auth: AuthService) { }

  ngOnInit(): void {

    this.route.queryParams.pipe(untilDestroyed(this)).subscribe(
      params => {
        if (!params.token || !params.email) {
          this.loading = false;
          this.errorMessage = 'Invalid Request';
          return;
        }
        this.request.token = params.token;
        this.request.email = params.email;
        this.verifyEmail();
      }
    );
  }

  verifyEmail(): void {
     this.auth.verifyEmail(this.request).pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.loading = false;
          this.success = true;
        },
        (err) => {
          this.loading = false;
          this.success = false;
          this.errorMessage = 'Failed to verify email';
        }
      );
  }

}
