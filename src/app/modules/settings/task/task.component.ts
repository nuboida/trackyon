import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TaskRequest, TaskResponse } from '@app/models/call-memo.model';
import { CallMemoService } from '@app/services/call-memo.service';
import { HotToastService } from '@ngneat/hot-toast';
import { TaskCreateComponent } from './task-create/task-create.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentService } from '@app/services/department.service';
import { DepartmentResponse } from '@app/models/department.model';
import { Observable } from 'rxjs';
import { TaskFilter } from '@app/models/task.model';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'olla-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, AfterViewInit {

  currentPage = 'Tasks';
  btnText = 'Task';
  cardText = 'Task';
  imageSrc = 'assets/task.svg';
  addToolTip = 'New Task';
  displayedColumns = ['position', 'task', 'dimension', 'kra', 'frequency', 'weight', 'buttons'];
  displayCoreColumns = ['values', 'keyActions', 'weight', 'buttons'];
  dataSource = new MatTableDataSource<TaskResponse>([]);
  kpiDataSource = new MatTableDataSource<TaskResponse>([]);
  coreDataSource = new MatTableDataSource<TaskResponse>([]);
  dept$!: Observable<DepartmentResponse[]>;
  deptOptions: any[] = [];
  dimensionOptions = Dimensions;
  frequencyOptions = Frequency;
  loading = false;
  filterOptions = Filters;
  filterInput: FormControl = new FormControl(0);
  dimensionInput = new FormControl('');
  frequencyInput = new FormControl('');
  kraInput = new FormControl('');
  deptInput = new FormControl(0);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private memoService: CallMemoService, public dialog: MatDialog, private toast: HotToastService,
              private route: ActivatedRoute, private deptService: DepartmentService) {}

  ngOnInit(): void {
    this.route.data.pipe(untilDestroyed(this)).subscribe(result => this.kpiDataSource.data = result.data);
    this.dept$ = this.deptService.getDepartments();
    this.dept$.pipe(untilDestroyed(this)).subscribe((res) => {
      const deptoptions = res.map(c => ({departmentId: c.departmentId, departmentName: c.departmentName }));
      this.deptOptions = [
        {departmentId: 0, departmentName: '-'},
        ...deptoptions
      ]
    })
    this.deptInput.valueChanges.pipe(untilDestroyed(this))
    .subscribe(() => {
      this.filterInput.setValue(0);
      this.dimensionInput.setValue('All');
      this.frequencyInput.setValue('All');
      this.getTasks(this.deptInput.value.toString());
    });

    this.kraInput.valueChanges.pipe(debounceTime(500), untilDestroyed(this))
      .subscribe(() => this.filterKRA());
  }

  ngAfterViewInit(): void {
    this.kpiDataSource.paginator = this.paginator;
  }

  getTasks(dept: string): void {
    this.memoService.getTasks(dept).pipe(untilDestroyed(this)).subscribe(
      data => {
        this.dataSource.data = data;
        this.coreDataSource.data = data.filter((task) => task.criteria === 'core');
        this.kpiDataSource.data = this.dataSource.data.filter((task) => task.criteria !== 'core' && task.name !== 'x');
      },
      () => this.toast.error('Error retrieving Tasks'),
      () => this.loading = false
    );
  }

  filterDimension(): void {
    if (this.dimensionInput.value === 'All') {
      this.kpiDataSource.data = this.dataSource.data.filter((task) => task.criteria !== 'core' && task.name !== 'x');
      return;
    }
    let dimensionExist = false;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dimensionInput.value === this.dataSource.data[i].dimensions) {
        dimensionExist = true;
        break;
      }
    }
    if (!dimensionExist) {
      return;
    }
    this.kpiDataSource.data = this.dataSource.data.filter(task => task.dimensions === this.dimensionInput.value && task.name !== 'x' && task.criteria !== 'core');
  }

  filterFrequency(): void {
    if (this.frequencyInput.value === 'All') {
      this.kpiDataSource.data = this.dataSource.data.filter((task) => task.criteria !== 'core' && task.name !== 'x');
      return;
    }
    let frequencyExist = false;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.frequencyInput.value === this.dataSource.data[i].frequency) {
        frequencyExist = true;
        break;
      }
    }
    if (!frequencyExist) {
      return;
    }
    this.kpiDataSource.data = this.dataSource.data.filter(task => task.frequency === this.frequencyInput.value && task.name !== 'x' && task.criteria !== 'core');
  }

  filterKRA(): void {
    let name = this.kraInput.value as string;
    if (!name) {
      this.kpiDataSource.data = this.dataSource.data.filter((task) => task.criteria !== 'core' && task.name !== 'x');
    }
    const tasks = this.dataSource.data.filter((task) => String(task.kra).toLowerCase().includes(name) && task.criteria !== 'core');
    if(!tasks.length || name === '') {
      this.kpiDataSource.data = this.dataSource.data.filter((task) => task.criteria !== 'core' && task.name !== 'x');
      return;
    }
    this.kpiDataSource.data = tasks;
  }

  createTask(): void {
    this.openDialog();
  }

  editTask(id: number, name: string, deptId: string, weight: number, criteria: string, dimension: string, frequency: string, kra: string, target: string): void {
    this.openDialog(id, name, deptId, weight, criteria, dimension, frequency, kra, target);
  }

  openDialog(id?: number, name?: string, deptId?: string, weight?: number, criteria?: string, dimension?: string, frequency?: string, kra?: string, target?: string): void {
    const dialogRef = this.dialog.open(TaskCreateComponent, { height: '600px', width: '600px', data: { id, name, deptId, weight, criteria, dimension, frequency, kra, target } });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.getTasks(this.deptInput.value.toString());
      }
    });
  }

}

interface Option {
  name: string;
  value: string;
}

const Filters: Option[] = [
  { name: 'All', value: 'All' },
  { name: 'Dimensions', value: 'Dimensions' },
  { name: 'Key Result Areas', value: 'kra' },
  { name: 'Frequency', value: 'Frequency' }
];

const Dimensions = [
  { name: 'All', value: 'All' },
  { name: 'Functional', value: 'Functional' },
  { name: 'Financial', value: 'Financial' },
  { name: 'Customer', value: 'Customer' },
  { name: 'Process', value: 'Process' },
  { name: 'People', value: 'People' },
  { name: 'Project', value: 'Project' },
  { name: 'Other', value: ' ' }
];

const Frequency = [
  { name: 'All', value: 'All' },
  { name: 'Weekly', value: 'Weekly'},
  { name: 'Monthly', value: 'Monthly'},
  { name: 'Quarterly', value: 'Quarterly'},
  { name: 'Annually', value: 'Annually'},
]
