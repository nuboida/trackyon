import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from '@app/models/auth.model';
import { AuthService } from '@app/services/auth.service';
import { ErrorResponse } from '@app/models/error.model';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  request: LoginRequest = {
    email: '',
    password: ''
  };
  loading = false;
  company!: string;

  loginForm!: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService,
              private toast: HotToastService) {}

  ngOnInit(): void {
    this.authService.company$.pipe(untilDestroyed(this)).subscribe(
      info => {
        if (!info) {
          this.router.navigate(['/auth/verify-company']);
        }
      }
    );
    this.loginForm = this.fb.group({
      email: [this.request.email, [Validators.required, Validators.email]],
      password: [this.request.password, [Validators.required, Validators.minLength(5)]]
    });
  }

  login(): void {
    const data = {...this.request, ...this.loginForm.value} as LoginRequest;
    this.loading = true;
    this.authService.login(data).pipe(untilDestroyed(this)).subscribe(
      resp => {

        if (!resp.verified) {
          this.toast.show('Please verify your email first');
          this.router.navigate(['/auth/send-verification']);
          return;
        }

        if (resp.verified && !resp.passwordChanged) {
          this.toast.show('Please change your password');
          this.router.navigate(['/auth/change-password'], {
            queryParams: {
              email: data.email
            }
          });
          return;
        }

        this.authService.goToDashboard();
      },
      (err: ErrorResponse) => {
        this.loading = false;
        this.toast.error(err.message);
      }
    );
  }
}
