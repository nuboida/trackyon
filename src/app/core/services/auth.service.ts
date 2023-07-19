import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CompanyResponse, LoginRequest,
  LoginResponse, RegisterRequest,
  ForgotPasswordRequest, ResetPasswordRequest,
  ChangePasswordRequest, VerifyEmailRequest
} from '@app/models/auth.model';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Company, Token, User } from '@app/helpers/auth.helper';
import { AuthRoutes } from '@app/helpers/routes.helper';
import { GlobalResponse } from '@app/models/response.model';


@Injectable()
export class AuthService {

  private user = new BehaviorSubject<LoginResponse | null>(null);
  private company = new BehaviorSubject<CompanyResponse | null>(null);

  pattern = '^.*(?=.{7,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#@:;/.,<>|`~*()$%&? \"]).*$';

  user$ = this.user.asObservable().pipe(
    map(user => {
      if (user) {
        return user;
      }
      return this.getUser() as LoginResponse;
    })
  );

  company$ = this.company.asObservable().pipe(
    map(company => {
      if (company) {
        return company;
      }
      return this.sessionCompany as CompanyResponse;
    })
  );

  private get sessionCompany(): CompanyResponse | null {
    const sessionCompany = sessionStorage.getItem(Company);
    if (sessionCompany) {
      const decoded = atob(sessionCompany);
      return JSON.parse(decoded) as CompanyResponse;
    }
    return null;
  }

  constructor(private api: ApiService, private jwt: JwtHelperService, private router: Router) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>(AuthRoutes.Login, request).pipe(
      map(resp => {
        resp.staffImageUrl = resp.staffImageUrl ? resp.staffImageUrl : '';
        resp.companyLogoUrl = resp.companyLogoUrl ? resp.companyLogoUrl : '';
        return resp;
      }),
      tap(response => {
        if (response.verified && response.passwordChanged) {
          sessionStorage.setItem(Token, response.token);
          sessionStorage.setItem(User, btoa(JSON.stringify(response)));
          this.updateUser(response);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !this.jwt.isTokenExpired();
  }

  logout(): void {
    sessionStorage.removeItem(User);
    sessionStorage.removeItem(Token);
    this.updateUser(null);
    this.router.navigate([`/auth/login`]);
  }

  register(request: RegisterRequest): Observable<GlobalResponse> {
    const formData = new FormData();
    formData.append('name', request.name);
    formData.append('userFirstName', request.userFirstName);
    formData.append('userLastName', request.userLastName);
    formData.append('address', request.address);
    formData.append('phone', request.phone);
    formData.append('password', request.password);
    formData.append('logo', request.logo as File);
    formData.append('email', request.email);
    return this.api.postFile<GlobalResponse>(AuthRoutes.Register, formData);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(AuthRoutes.ForgotPassword, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(AuthRoutes.ResetPassword, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(AuthRoutes.ChangePassword, request);
  }

  verifyEmail(request: VerifyEmailRequest): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(AuthRoutes.VerifyEmail, request);
  }

  sendVerificationEmail(request: VerifyEmailRequest): Observable<GlobalResponse> {
    return this.api.post<GlobalResponse>(AuthRoutes.SendVerification, request);
  }

  getCompany(name: string): Observable<CompanyResponse> {
    return this.api.get<CompanyResponse>(AuthRoutes.GetCompany.replace('companyName', name)).pipe(
      tap(resp => {
        sessionStorage.setItem(Company, btoa(JSON.stringify(resp)));
        this.updateCompany(resp);
      })
    );
  }

  invalidateCompany(): void {
    sessionStorage.clear();
    this.updateCompany(null);
  }

  goToDashboard(): void {
    this.router.navigate([`/home`]);
  }

  updateUser(user: LoginResponse | null): void {
    this.user.next(user);
  }

  private getUser(): LoginResponse | null {
    const sessionUser = sessionStorage.getItem(User);
    if (sessionUser) {
      const decoded = atob(sessionUser);
      return JSON.parse(decoded) as LoginResponse;
    }
    return null;
  }

  private updateCompany(company: CompanyResponse | null): void {
    this.company.next(company);
  }
}
