import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from '@app/models/auth.model';
import { ErrorResponse } from '@app/models/error.model';
import { AuthService } from '@app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ValidatePasswordMatch } from '@shared/validators/confirmed.validator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  logo: string | ArrayBuffer | null = '';
  request: RegisterRequest = {
    name: '',
    userFirstName: '',
    userLastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    logo: null
  };
  loading = false;

  registerForm!: FormGroup;
  constructor(private router: Router, private fb: FormBuilder,
              private authService: AuthService, private toast: HotToastService) {}

  ngOnInit(): void {
    this.authService.invalidateCompany();
    this.registerForm = this.fb.group({
      email: [this.request.email, [Validators.required, Validators.email]],
      password: [this.request.password, [Validators.required, Validators.pattern(this.authService.pattern)]],
      name: [this.request.email, Validators.required],
      userFirstName: [this.request.userFirstName, Validators.required],
      userLastName: [this.request.userLastName, Validators.required],
      address: [this.request.address, Validators.required],
      phone: [this.request.phone, Validators.required],
      confirm: ['', Validators.required]
    }, {
      validators: [ValidatePasswordMatch.validate]
    });
  }

  get f(): any { return this.registerForm.controls; }

  imageSelected(files: FileList | null): void {
    if (files?.length) {
      const file = files[0];
      const acceptableTypes = ['image/jpeg', 'image/png'];
      if (!acceptableTypes.includes(file.type)) {
        this.toast.warning('Invalid Filetype');
        return;
      }

      this.request.logo = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.logo = reader.result;
      };
    }
  }

  register(): void {
    if (!this.request.logo) {
      this.toast.warning('Please select an image');
      return;
    }
    const data = {...this.request, ...this.registerForm.value} as RegisterRequest;
    this.loading = true;
    this.authService.register(data).pipe(untilDestroyed(this)).subscribe(
      () => {
        this.toast.success('Registered Successfully');
        this.router.navigate(['/auth/verify-company']);
      },
      (err: ErrorResponse) => {
        this.loading = false;
        this.toast.error(err.message);
      }
    );


  }

}
