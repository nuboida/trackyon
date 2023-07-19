import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorResponse } from '@app/models/error.model';
import { OemCreateRequest } from '@app/models/oem.model';
import { OemService } from '@app/services/oem.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-oem-create',
  templateUrl: './oem-create.component.html',
  styleUrls: ['./oem-create.component.scss']
})
export class OemCreateComponent implements OnInit {

  loading = false;
  oemForm!: FormGroup;
  data: OemCreateRequest = {
    name: '',
    companyId: ''
  };

  nameCtrl = new FormControl(this.data.name, Validators.required);
  constructor(private fb: FormBuilder, private oemService: OemService, private toast: HotToastService,
              public dialogRef: MatDialogRef<OemCreateComponent>) { }

  ngOnInit(): void {
    this.oemForm = this.fb.group({
      name: this.nameCtrl
    });
  }

  addOem(): void {
    this.loading = true;
    this.data.name = this.nameCtrl.value as string;
    this.oemService.createOem(this.data).pipe(untilDestroyed(this)).subscribe(
      () => {
        this.toast.success('OEM Added');
        this.dialogRef.close('Success');
      },
      (err: ErrorResponse) => {
        this.loading = false;
        this.toast.error(err.message);
      }
    );
  }

}
