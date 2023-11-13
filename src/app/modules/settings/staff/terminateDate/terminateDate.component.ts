import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatAPIDate } from '@app/helpers/date.helper';
import { ErrorResponse } from '@app/models/error.model';
import { StaffCreateRequest, StaffUpdateRequest } from '@app/models/staff.model';
import { StaffService } from '@app/services/staff.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'olla-terminateDate',
  templateUrl: './terminateDate.component.html',
})
export class TerminateDateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  data: StaffCreateRequest = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    systemRole: [],
    department: '',
    password: '',
    officeRole: '',
    address: '',
    target: 0,
    birthDate: '',
    dateOfResumption: '',
    dateOfTermination: '',
    grade: '',
  };
  constructor(
    public dialogRef: MatDialogRef<TerminateDateComponent>,
    private fb: FormBuilder,
    private staffService: StaffService,
    private toast: HotToastService,
    @Inject(MAT_DIALOG_DATA) public info: {staffId: string}
  ) { }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.initializeForm();
    if (this.info.staffId) {
      this.staffService.getStaff(this.info.staffId).pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.form.patchValue({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phone,
            systemRole: data.systemRoles,
            department: data.department,
            departmentId: 0,
            officeRole: data.officeRole,
            address: data.address,
            target: data.target,
            birthDate: data.birthDate,
            dateOfResumption: data.dateOfResumption,
            dateOfTermination: data.dateOfTermination,
            grade: data.grade
          });
        }
      )
    }
  }

  initializeForm(): void {
    this.form = this.fb.group({
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      phoneNumber: [this.data.phoneNumber, Validators.required],
      systemRole: [this.data.systemRole, [Validators.required, Validators.minLength(1)]],
      password: [this.data.password, Validators.required],
      confirm: ['', Validators.required],
      department: [this.data.department, Validators.required],
      departmentId: [0, Validators.required],
      officeRole: [this.data.officeRole, Validators.required],
      address: [this.data.address],
      birthDate: [this.data.birthDate],
      target: [this.data.target],
      dateOfResumption: [this.data.dateOfResumption, Validators.required],
      dateOfTermination: [this.data.dateOfTermination, Validators.required],
      grade: [this.data.grade]
    });
  }

  submit(): void {
    this.loading = true;

    const request = {
      ...this.data,
      ...this.form.value,
      //dateOfTermination: this.form.controls['dateOfTermination'].value
      dateOfTermination: formatAPIDate(this.form.controls['dateOfTermination'].value)
    } as StaffUpdateRequest;
    request.staffId = this.info.staffId;

    this.staffService.updateStaff(request).pipe(untilDestroyed(this))
    .subscribe(
      () => {
        this.loading = false;
        this.returnToStaff('success');
      },
      (err: ErrorResponse) => {
        this.cancelDeactivation()
        this.loading = false;
      }
    )
  }

  returnToStaff(value?: string): void {
    this.dialogRef.close(value);
  }
  cancelDeactivation(): void {
    this.dialogRef.close();
  }

}
