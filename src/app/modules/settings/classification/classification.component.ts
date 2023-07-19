import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassificationResponse } from '@app/models/opportunity.model';
import { OpportunityService } from '@app/services/opportunity.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ClassificationCreateComponent } from './classification-create/classification-create.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@UntilDestroy()
@Component({
  selector: 'olla-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.scss']
})
export class ClassificationComponent implements OnInit, AfterViewInit {

  currentPage = 'Classifications';
  btnText = 'Classification';
  cardText = 'classification';
  imageSrc = 'assets/classification.svg';
  displayedColumns = ['position', 'classification', 'buttons'];
  dataSource = new MatTableDataSource<ClassificationResponse>([]);
  loading = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  addToolTip = 'New Classification';

  constructor(private opptService: OpportunityService, public dialog: MatDialog,
              private toast: HotToastService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(untilDestroyed(this)).subscribe(result => this.dataSource.data = result.data);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getClassifications(): void {
    this.loading = true;
    this.opptService.getClassifications().pipe(untilDestroyed(this)).subscribe(
      data => this.dataSource.data = data,
      () => this.toast.error('Error retrieving classifications'),
      () => this.loading = false
    );
  }

  createClassification(): void {
    this.openDialog();
  }

  editClassification(id: number, name: string): void {
    this.openDialog(id, name);
  }

  openDialog(id?: number, name?: string): void {
    const dialogRef = this.dialog.open(ClassificationCreateComponent, { width: '400px', data: { id, name } });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result) {
        this.getClassifications();
      }
    });
  }

}
