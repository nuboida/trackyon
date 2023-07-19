import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorResponse } from '@app/models/error.model';
import { AuthService } from '@app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-verify-company',
  templateUrl: './verify-company.component.html',
  styleUrls: ['./verify-company.component.scss']
})
export class VerifyCompanyComponent implements OnInit {

  loading = false;

  verifyForm!: FormGroup;
  constructor(private router: Router, private fb: FormBuilder,
              private authService: AuthService, private toast: HotToastService) {}

  ngOnInit(): void {
    this.authService.invalidateCompany();
    this.verifyForm = this.fb.group({
      company: ['', Validators.required],
    });
  }

  verify(): void {
    const data = this.verifyForm.get('company')?.value as string;
    this.loading = true;
    this.authService.getCompany(data).pipe(untilDestroyed(this)).subscribe(
      () => this.router.navigate([`/auth/login`]),
      (err: ErrorResponse) => {
        this.loading = false;
        this.toast.error(err.message);
      }
    );


  }

}
