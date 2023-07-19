import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponse } from '@app/models/error.model';
import { AuthService } from '@app/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => this.formatErrors(err)));
  }

  private formatErrors(error: HttpErrorResponse): Observable<any> {
    const errorResponse: ErrorResponse = {
      message: ''
    };
    switch (error.status) {
      case 400:
      case 404:
        errorResponse.message = error.error.title || error.error.message;
        break;
      case 401:
        errorResponse.message = 'You are not signed in';
        this.auth.logout();
        break;
      case 403:
        errorResponse.message = 'You are not authorised';
        break;
      default:
        errorResponse.message = 'Something went wrong';
        break;
    }
    return throwError(errorResponse);
  }
}
