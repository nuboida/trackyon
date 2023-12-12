import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorResponse } from '@app/models/error.model';
import { GlobalEdit } from '@app/models/response.model';
import { CallMemoService } from '@app/services/call-memo.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent implements OnInit {

  loading = false;
  form!: FormGroup;
  id!: number;

  nameCtrl = new FormControl('', Validators.required);

  constructor(private fb: FormBuilder, private memoService: CallMemoService,
              private toast: HotToastService,
              @Inject(MAT_DIALOG_DATA) public data: {id: number, name: string},
              public dialogRef: MatDialogRef<ProjectCreateComponent>) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: this.nameCtrl
    });

    if (this.data.id) {
      this.id = this.data.id;
      this.form.setValue({name: this.data.name});
    }
  }

  submit(): void {
    this.loading = true;
    const value = this.form.get('name')?.value  as string;

    if (this.id) {
      const request: GlobalEdit = {
        id: this.id,
        newValue: value
      };

      this.memoService.editProject(request).pipe(untilDestroyed(this)).subscribe(
        () => {
          this.toast.success('Project Updated');
          this.dialogRef.close('Success');
        },
        (err: ErrorResponse) => {
          this.loading = false;
          this.toast.error(err.message);
        }
      );
    }

    if (!this.id) {
      this.memoService.createProject(value).pipe(untilDestroyed(this)).subscribe(
        () => {
          this.toast.success('Project Added');
          this.dialogRef.close('Success');
        },
        (err: ErrorResponse) => {
          this.loading = false;
          this.toast.error(err.message);
        }
      );
    }
  }
}
