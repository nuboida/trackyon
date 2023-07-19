import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorResponse } from '@app/models/error.model';
import { OemContactCreateRequest } from '@app/models/oem.model';
import { OemService } from '@app/services/oem.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-oem-contact-create',
  templateUrl: './oem-contact-create.component.html',
  styleUrls: ['./oem-contact-create.component.scss']
})
export class OemContactCreateComponent implements OnInit {

  loading = false;
  contactForm!: FormGroup;
  data: OemContactCreateRequest = {
    name: '',
    phone: '',
    email: '',
    isMain: false,
    oemId: '',
  };

  nameCtrl = new FormControl(this.data.name, Validators.required);
  phoneCtrl = new FormControl(this.data.phone, Validators.required);
  emailCtrl = new FormControl(this.data.email, [Validators.required, Validators.email]);
  mainCtrl = new FormControl(this.data.isMain, Validators.required);
  constructor(private fb: FormBuilder, private oemService: OemService,
              public dialogRef: MatDialogRef<OemContactCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public info: {oemId: string},
              private toast: HotToastService) {
      this.data.oemId = info.oemId;
    }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: this.nameCtrl,
      phone: this.phoneCtrl,
      email: this.emailCtrl,
      isMain: this.mainCtrl
    });
  }

  addContact(): void {
    this.loading = true;
    const request = {...this.data, ...this.contactForm.value} as OemContactCreateRequest;
    this.oemService.createOemContact(request).pipe(untilDestroyed(this))
    .subscribe(
      () => {
        this.toast.success('Contact Added');
        this.dialogRef.close('Success');
      },
      (err: ErrorResponse) => {
        this.loading = false;
        this.toast.error(err.message);
      }
    );
  }

}
