import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordRequest } from '@app/models/auth.model';
import { AuthService } from '@app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ValidatePasswordMatch } from '@shared/validators/confirmed.validator';

@UntilDestroy()
@Component({
  selector: 'olla-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form!: FormGroup;
  request: ResetPasswordRequest = {
    email: '',
    password: '',
    confirmPassword: '',
    token: ''
  };

  constructor(private auth: AuthService, private toast: HotToastService,
              private route: ActivatedRoute, private router: Router,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(untilDestroyed(this)).subscribe(
      params => {
        if (!params['token'] || !params['email']) {
          this.toast.warning('Invalid Request');
          this.router.navigate(['/auth/verify-company']);
          return;
        }
        this.request.token = params['token'];
        this.request.email = params['email'];
      }
    );

    this.form = this.fb.group({
      password: [this.request.password, [Validators.required, Validators.pattern(this.auth.pattern)]],
      confirm: [this.request.confirmPassword, Validators.required]
    }, {
      validators: [ValidatePasswordMatch.validate]
    });
  }

  get f(): any { return this.form.controls; }

  update(): void {

    this.request.password = this.form.get('password')?.value;
    this.request.confirmPassword = this.form.get('confirm')?.value;

    this.auth.resetPassword(this.request).pipe(
      this.toast.observe(
        {
          loading: 'Updating...',
          success: 'Password update!',
          error: 'Could not update your password.',
        }
      ),
      untilDestroyed(this)
    ).subscribe(() => this.router.navigate(['/auth/verify-company']));
  }

}
