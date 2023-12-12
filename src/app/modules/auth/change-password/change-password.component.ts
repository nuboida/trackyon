import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePasswordRequest } from '@app/models/auth.model';
import { AuthService } from '@app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { ValidatePasswordMatch } from '@shared/validators/confirmed.validator';

@UntilDestroy()
@Component({
  selector: 'olla-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  loading = false;
  request: ChangePasswordRequest = {
    email: '',
    currentPassword: '',
    newPassword: ''
  };
  form!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,
              private toast: HotToastService, private route: ActivatedRoute ) { }

  ngOnInit(): void {

    this.route.queryParams.pipe(untilDestroyed(this)).subscribe(
      params => {
        if (!params['email']) {
          this.toast.warning('Invalid Request');
          this.router.navigate(['/auth/verify-company']);
          return;
        }
        this.request.email = params['email'];
      }
    );

    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(this.auth.pattern)]],
      confirm: ['', [Validators.required]]
    }, {
      validators: [ValidatePasswordMatch.validate]
    });
  }

  get f(): any { return this.form.controls; }

  change(): void {

    this.loading = true;
    this.request.currentPassword = this.form.get('currentPassword')?.value;
    this.request.newPassword = this.form.get('password')?.value;
    this.auth.changePassword(this.request).pipe(untilDestroyed(this))
    .subscribe(
      () => {
        this.toast.success('Password Changed');
        this.router.navigate(['/auth/login']);
      },
      (err) => {
        this.loading = false;
        this.toast.error('Failed to change password');
      }
    );
  }

}
