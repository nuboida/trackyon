import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'olla-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {

  logo = '';
  protected stop$ = new Subject<void>();
  private image = 'assets/Logo-main.png';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.company$.pipe(takeUntil(this.stop$)).subscribe(
      company => {
        setTimeout(() => {
          this.logo = company?.logo || this.image;
      });
    });
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
