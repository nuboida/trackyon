import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorResponse } from '@app/models/error.model';
import { GlobalEdit } from '@app/models/response.model';
import { DepartmentService } from '@app/services/department.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.scss']
})
export class DepartmentCreateComponent implements OnInit {

  loading = false;
  form!: FormGroup;
  id: number;

  departmentNameCtrl = new FormControl('', Validators.required);
  constructor(
    private fb: FormBuilder,
    private toast: HotToastService,
    private deptService: DepartmentService,
    @Inject(MAT_DIALOG_DATA) public data: {id: number, departmentName: string},
    public dialogRef: MatDialogRef<DepartmentCreateComponent>
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      departmentName: this.departmentNameCtrl
    });

    if (this.data.id) {
      this.id = this.data.id;
      this.form.setValue({departmentName: this.data.departmentName});
    }
  }

  submit(): void {
    this.loading = true;
    const value = this.form.get('departmentName')?.value as string;

    if (this.id) {
      const request: GlobalEdit = {
        id: this.id,
        newValue: value
      };

      this.deptService.editDepartment(request).pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.toast.success('Department Updated');
          this.dialogRef.close('Success');
        },
        (err: ErrorResponse) => {
          this.loading = false;
          this.toast.error(err.message);
        }
      )
    }

    if (!this.id) {
      this.deptService.createDepartment(value).pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.toast.success('Department Added');
          this.dialogRef.close('Success');
        },
        (err: ErrorResponse) => {
          this.loading = false;
          this.toast.error(err.message);
        }
      )
    }
  }

}
