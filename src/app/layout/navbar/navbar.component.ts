import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'olla-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  companyName = '';
  companyLogo = '';
  userImage = 'assets/placeholder.png';
  protected stop$ = new Subject<void>();
  protected logo = 'assets/Logo-main.png';
  @Output() sidenav = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user$.pipe(takeUntil(this.stop$)).subscribe(
      user => {
        if (user) {
          this.companyName = user.companyName;
          this.userImage = user.staffImageUrl || this.userImage;
          this.companyLogo = user.companyLogoUrl || this.logo;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }

  profile(): void {
    this.router.navigateByUrl('/profile');
  }

  logout(): void {
    this.authService.logout();
  }
}
