import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SendVerificationComponent } from './send-verification/send-verification.component';
import { VerifyCompanyComponent } from './verify-company/verify-company.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes: Routes = [

  { path: 'register', component: RegisterComponent },
  { path: 'verify-company', component: VerifyCompanyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'send-verification', component: SendVerificationComponent},
  { path: 'verify-email', component: VerifyEmailComponent},
  { path: 'change-password', component: ChangePasswordComponent },
  { path: '', redirectTo: '/auth/verify-company', pathMatch: 'full'},
  { path: '**', redirectTo: '/auth/verify-company', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
  static components = [
    LoginComponent, ForgotPasswordComponent,
    RegisterComponent, VerifyCompanyComponent,
    ResetPasswordComponent, SendVerificationComponent,
    VerifyEmailComponent, ChangePasswordComponent
  ];
}
