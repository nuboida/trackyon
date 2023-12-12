import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangePasswordRequest, LoginResponse } from '@app/models/auth.model';
import { ChangePictureRequest } from '@app/models/staff.model';
import { AuthService } from '@app/services/auth.service';
import { StaffService } from '@app/services/staff.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ValidatePasswordMatch } from '@shared/validators/confirmed.validator';

@UntilDestroy()
@Component({
  selector: 'olla-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentPage = 'Profile';
  loading = false;
  request: ChangePasswordRequest = {
    email: '',
    currentPassword: '',
    newPassword: ''
  };

  staff!: LoginResponse;
  role!: string;
  date = new Date();

  form!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService,
              private toast: HotToastService, private staffService: StaffService) { }

  ngOnInit(): void {

    this.auth.user$.pipe(untilDestroyed(this)).subscribe(
      user => {
        this.staff = user;
        if (!this.staff?.staffImageUrl) {
          this.staff.staffImageUrl = 'assets/placeholder.png';
        }
        this.role = user?.roles[0].replace(/([a-z])([A-Z])/, '$1 $2');
        this.request.email = user?.email;
      }
    );

    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      password: [this.request.newPassword, [Validators.required, Validators.pattern(this.auth.pattern)]],
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
        this.loading = false;
        this.toast.success('Password Updated');
      },
      (err) => {
        this.loading = false;
        this.toast.error(err.message);
      }
    );
  }

  imageSelected(files: FileList | null): void {
    if (files?.length) {
      const file = files[0];
      const acceptableTypes = ['image/jpeg', 'image/png'];
      if (!acceptableTypes.includes(file.type)) {
        this.toast.warning('Invalid Filetype');
        return;
      }

      const request: ChangePictureRequest = {
        staffId: this.staff.staffId,
        image: file
      };

      const loading = this.toast.loading('Uploading...');

      this.staffService.changePicture(request).pipe(untilDestroyed(this))
        .subscribe(
          resp => {
            loading.close();
            this.toast.success('Image Uploaded');
            const user: LoginResponse = {...this.staff, staffImageUrl: resp.message };
            this.auth.updateUser(user);
          },
          () => {
            loading.close();
            this.toast.error('Image could\'t be uploaded');
          }
        );
    }
  }
}
