import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProjectResponse } from '@app/models/call-memo.model';
import { CallMemoService } from '@app/services/call-memo.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@UntilDestroy()
@Component({
  selector: 'olla-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, AfterViewInit {

  currentPage = 'Projects';
  btnText = 'Project';
  cardText = 'Project';
  imageSrc = 'assets/project.svg';
  addToolTip = 'New Project';
  displayedColumns = ['position', 'project', 'buttons'];
  dataSource = new MatTableDataSource<ProjectResponse>([]);
  loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private toast: HotToastService, private memoService: CallMemoService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(untilDestroyed(this)).subscribe(result => this.dataSource.data = result['data']);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getProjects(): void {
    this.memoService.getProjects().pipe(untilDestroyed(this)).subscribe(
      data => this.dataSource.data = data,
      () => this.toast.error('Error retrieving projects'),
      () => this.loading = false
    );
  }

  createProject(): void {
    this.openDialog();
  }

  editProject(id: number, name: string): void {
    this.openDialog(id, name);
  }

  openDialog(id?: number, name?: string): void {
    const dialogRef = this.dialog.open(ProjectCreateComponent, { width: '400px', data: { id, name } });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.getProjects();
      }
    });
  }

}
