import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepartmentResponse } from '@app/models/department.model';
import { ErrorResponse } from '@app/models/error.model';
import { StaffResponse } from '@app/models/staff.model';
import { CallMemoService } from '@app/services/call-memo.service';
import { DepartmentService } from '@app/services/department.service';
import { StaffService } from '@app/services/staff.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'olla-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent implements OnInit {

  loading = false;
  form!: FormGroup;
  id: number;
  dept$!: Observable<DepartmentResponse[]>;
  staff$!: Observable<StaffResponse[]>;

  dimensionOptions = Dimensions;
  criteriaOptions = Criteria;
  frequencyOptions = Frequency;

  nameCtrl = new FormControl('', Validators.required);
  deptCtr = new FormControl('', Validators.required);
  staffIdCtrl = new FormControl([], Validators.required);
  weightCtrl = new FormControl(0, Validators.required);
  dimensionCtrl = new FormControl('');
  kraCtrl = new FormControl('');
  frequencyCtrl = new FormControl('');
  criteriaCtrl = new FormControl('', Validators.required);
  targetCtrl = new FormControl('');


  constructor(private fb: FormBuilder, private memoService: CallMemoService,
              private toast: HotToastService, private deptService: DepartmentService,
              @Inject(MAT_DIALOG_DATA) public data: {id: number, name: string, deptId: string, weight: number, criteria: string, dimension: string, staffId: string[], frequency: string, kra: string, target: string},
              public dialogRef: MatDialogRef<TaskCreateComponent>, private staffService: StaffService) {}

  ngOnInit(): void {
    console.log(this.data);
    this.staff$ = this.staffService.getStaffs();
    this.form = this.fb.group({
      name: this.nameCtrl,
      dept: this.deptCtr,
      staffIds: this.staffIdCtrl,
      weight: this.weightCtrl,
      criteria: this.criteriaCtrl,
      dimension: this.dimensionCtrl,
      kra: this.kraCtrl,
      frequency: this.frequencyCtrl,
      target: this.targetCtrl,
    });

    if (this.data.id) {
      this.id = this.data.id;
      this.nameCtrl.setValue(this.data.name);
      this.deptCtr.setValue(this.data.deptId);
      this.weightCtrl.setValue(this.data.weight);
      this.criteriaCtrl.setValue(this.data.criteria),
      this.dimensionCtrl.setValue(this.data.dimension),
      this.frequencyCtrl.setValue(this.data.frequency),
      this.staffIdCtrl.setValue(this.data.staffId),
      this.kraCtrl.setValue(this.data.kra),
      this.targetCtrl.setValue(this.data.target)
    }
    this.dept$ = this.deptService.getDepartments();
  }

  submit(): void {

    this.loading = true;

    if (this.id) {
      const request = {
        id: this.id,
        name: this.nameCtrl.value,
        departmentId: this.deptCtr.value,
        staffId: this.staffIdCtrl.value,
        weight: this.weightCtrl.value,
        frequency: this.frequencyCtrl.value as string,
        criteria: this.criteriaCtrl.value as string,
        dimensions: this.dimensionCtrl.value as string,
        kra: this.kraCtrl.value as string,
        target: this.targetCtrl.value as string
      };

      this.memoService.editTask(request).pipe(untilDestroyed(this))
      .subscribe(
        () => {
          this.toast.success('Task Updated');
          this.dialogRef.close('Success');
        },
        (err: ErrorResponse) => {
          this.loading = false;
          this.toast.error(err.message);
        }
      );
    }

    if (!this.id) {
      const request = {
        name: this.nameCtrl.value as string,
        departmentId: this.deptCtr.value as number,
        staffId: this.staffIdCtrl.value,
        weight: this.weightCtrl.value as number,
        frequency: this.frequencyCtrl.value as string,
        criteria: this.criteriaCtrl.value as string,
        dimensions: this.dimensionCtrl.value as string,
        kra: this.kraCtrl.value as string,
        target: this.targetCtrl.value as string,
      };

      this.memoService.createTask(request).pipe(untilDestroyed(this))
        .subscribe(
          () => {
            this.toast.success('Task Added');
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

interface Option {
  name: string;
  value: string;
}

const Dimensions: Option[] = [
  { name: 'Functional', value: 'Functional' },
  { name: 'Financial', value: 'Financial' },
  { name: 'Customer', value: 'Customer' },
  { name: 'Process', value: 'Process' },
  { name: 'People', value: 'People' },
  { name: 'Project', value: 'Project' },
  { name: 'Other', value: 'Other' }
];

const Criteria: Option[] = [
  { name: 'Core Values', value: 'core' },
  { name: 'Key Performance Indicator', value: 'kpi' }
];

const Frequency: Option[] = [
  { name: 'Weekly', value: 'Weekly' },
  { name: 'Monthly', value: 'Monthly' },
  { name: 'Quarterly', value: 'Quarterly' },
  { name: 'Annually', value: 'Annually' }
]
