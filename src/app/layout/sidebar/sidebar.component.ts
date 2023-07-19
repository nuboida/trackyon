import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'olla-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  activeDropdown = '';
  fullName = '';
  role = '';
  userImage = 'assets/placeholder.png';
  companyName = '';
  isAdmin = false;
  protected stop$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.pipe(takeUntil(this.stop$)).subscribe(
      user => {
        this.fullName = `${user?.firstName} ${user?.lastName}`;
        const roles = user?.roles;
        if (roles) {
          this.role = roles[0].replace(/([a-z])([A-Z])/, '$1 $2');
          this.isAdmin = roles.includes('Administrator');
        }

        this.userImage = user?.staffImageUrl || this.userImage;
        this.companyName = user?.companyName;
      }
    );
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }

  currentDropdown(link: string): boolean {
    return this.activeDropdown === link;
  }

  changeDropdown(link: string): void {
    if (this.currentDropdown(link)) {
      this.activeDropdown = '';
    } else {
      this.activeDropdown = link;
    }
  }
}
