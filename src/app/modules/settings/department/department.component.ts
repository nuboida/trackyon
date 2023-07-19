import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TaskResponse } from '@app/models/call-memo.model';
import { DepartmentResponse } from '@app/models/department.model';
import { DepartmentService } from '@app/services/department.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DepartmentCreateComponent } from './department-create/department-create.component';

@UntilDestroy()
@Component({
  selector: 'olla-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, AfterViewInit {
  currentPage = 'Departments'
  btnText = 'Department'
  cardText = 'department';
  imageSrc = 'assets/tasks.svg'
  addToolTip = 'New Department'
  displayedColumns = ['position', 'task', 'buttons'];
  dataSource = new MatTableDataSource<DepartmentResponse>([]);
  loading = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private departmentService: DepartmentService,
    private toast: HotToastService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.data.pipe(untilDestroyed(this)).subscribe(result => this.dataSource.data = result.data);
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getTasks(): void {
    this.departmentService.getDepartments().pipe(untilDestroyed(this)).subscribe(
      data => this.dataSource.data = data,
      () => this.toast.error('Error retrieving Departments'),
      () => this.loading = false
    )
  }

  createDepartment(): void {
    this.openDialog();
  }

  editDepartment(id: number, departmentName: string): void {
    this.openDialog(id, departmentName);
  }

  openDialog(id?: number, departmentName?: string): void {
    const dialogRef = this.dialog.open(DepartmentCreateComponent, { width: '400px', data: {id, departmentName}});

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.getTasks();
      }
    })
  }

}
