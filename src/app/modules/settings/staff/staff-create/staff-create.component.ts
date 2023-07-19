import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorResponse } from '@app/models/error.model';
import { RoleResponse, StaffCreateRequest, StaffUpdateRequest } from '@app/models/staff.model';
import { StaffService } from '@app/services/staff.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ValidatePasswordMatch } from '@shared/validators/confirmed.validator';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DepartmentResponse } from '@app/models/department.model';
import { DepartmentService } from '@app/services/department.service';

@UntilDestroy()
@Component({
  selector: 'olla-staff-create',
  templateUrl: './staff-create.component.html',
  styleUrls: ['./staff-create.component.scss']
})
export class StaffCreateComponent implements OnInit {

  loading = false;
  roles$!: Observable<RoleResponse[]>;
  dept$!: Observable<DepartmentResponse[]>;
  deptOptions: any[] = [];
  form!: FormGroup;
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
    grade: '',
  };
  currentPage = 'New Staff';
  editMode = false;

  constructor(
    public dialogRef: MatDialogRef<StaffCreateComponent>,
    private fb: FormBuilder,
    private staffService: StaffService,
    private toast: HotToastService,
    private deptService: DepartmentService,
    @Inject(MAT_DIALOG_DATA) public info: {staffId: string}
    ) {

    }

  ngOnInit(): void {
    this.getOptions();
    this.initializeForm();
    this.dept$ = this.deptService.getDepartments();
    this.dept$.pipe(untilDestroyed(this)).subscribe((res) => {
      const deptOptions = res.map(c => ({departmentId: c.departmentId, departmentName: c.departmentName}));
      this.deptOptions = [
        ...deptOptions
      ]
    });
    this.form.controls['departmentId'].valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.deptOptions.map(c => {
        if (this.form.controls['departmentId'].value === c.departmentId) {
          this.form.controls['department'].setValue(c.departmentName);
        }
      })
    });

    if (this.info.staffId) {
      this.form.disable();
      this.editMode = true;
      this.currentPage = 'Update Staff';
      this.staffService.getStaff(this.info.staffId).pipe(untilDestroyed(this))
      .subscribe(
        data => {
          this.form.patchValue({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phone,
            systemRole: data.systemRoles,
            department: '',
            departmentId: 0,
            officeRole: data.officeRole,
            address: data.address,
            target: data.target,
            birthDate: data.birthDate,
            dateOfResumption: data.dateOfResumption,
            grade: data.grade
          });

          this.form.enable();
          this.form.controls['email'].disable();
          this.form.controls['password'].disable();
          this.form.controls['confirm'].disable();
          this.form.controls['systemRole'].disable();
        }
      );
    }
  }

  getOptions(): void {
    this.roles$ = this.staffService.getRoles();
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
      grade: [this.data.grade]
    }, {
      validators: [ValidatePasswordMatch.validate]
    });

  }

  get f(): any {
    return this.form.controls;
  }

  returnToStaff(value?: string): void {
    this.dialogRef.close(value);
  }

  createStaff(): void {
    this.loading = true;

    if (this.editMode) {
      const request = {...this.data, ...this.form.value} as StaffUpdateRequest
      request.staffId = this.info.staffId;
      this.staffService.updateStaff(request).pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.toast.success('Staff Updated');
          this.returnToStaff('Success');
        },
        (err: ErrorResponse) => {
          this.toast.error(err.message);
          this.loading = false;
        }
      )
    }

    if (!this.editMode) {
      const request = {...this.data, ...this.form.value} as StaffCreateRequest;
      this.staffService.createStaff(request).pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.toast.success('Staff Added');
          this.returnToStaff('Success');
        },
        (err: ErrorResponse) => {
          this.toast.error(err.message);
          this.loading = false;
        }
      );
    }
  }

}
